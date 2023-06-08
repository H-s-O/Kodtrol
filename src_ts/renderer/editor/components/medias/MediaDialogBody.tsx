import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Intent, Spinner, SpinnerSize } from '@blueprintjs/core';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import FileInput from '../ui/inputs/FileInput';
import SelectInput from '../ui/inputs/SelectInput';
import DurationInput from '../ui/inputs/DurationInput';
import { IOType } from '../../../../common/constants';
import { useKodtrolSelector } from '../../lib/hooks';
import { KODTROL_SUPPORTED_AUDIO_FORMATS } from '../../constants';
import { mediaInfo } from '../../lib/helpers';

const ACCEPT_AUDIO = KODTROL_SUPPORTED_AUDIO_FORMATS.map((format) => `.${format}`).join(',');

export default function MediaDialogBody({ value, onChange, validation }) {
  const {
    file,
    name,
    output,
    duration,
  } = value;

  const outputs = useKodtrolSelector((state) => state.outputs);
  const availableOutputs = useMemo(() => {
    return outputs.filter(({ type }) => type === IOType.AUDIO)
  }, [outputs]);

  const [fileChanged, setFileChanged] = useState(false);

  const fileChangeHandler = useCallback((value) => {
    onChange({
      file: value,
      duration: null,
    });
    setFileChanged(true);
  }, [onChange]);

  useEffect(() => {
    if (file && fileChanged) {
      mediaInfo(file)
        .then((info) => {
          onChange(info);
          setFileChanged(false);
        })
        .catch((err) => {
          console.error(err);
          setFileChanged(false);
        });
    }
  }, [onChange, file]);

  return (
    <>
      <InlineFormGroup
        label="File"
        helperText={!validation.file ? 'A file is mandatory.' : undefined}
        intent={!validation.file ? Intent.DANGER : undefined}
      >
        <FileInput
          fill
          name="file"
          inputProps={{
            accept: ACCEPT_AUDIO,
          }}
          value={file}
          onChange={fileChangeHandler}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Duration"
        intent={!validation.duration ? Intent.DANGER : undefined}
      >
        {!file ? (
          <TextInput
            readOnly
            disabled
            leftIcon="info-sign"
            value="<unknown>"
          />
        ) : duration === null ? (
          <Spinner
            size={SpinnerSize.SMALL}
          />
        ) : (
              <DurationInput
                disabled
                leftIcon="info-sign"
                value={duration}
              />
            )
        }
      </InlineFormGroup>
      <InlineFormGroup
        label="Name"
        helperText={!name ? 'If not set, Kodtrol will use the file name as the media name.' : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={onChange}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Output"
        helperText={!output ? 'If not set, the media can still be used in timelines, but will not play.' : undefined}
        intent={!output ? Intent.WARNING : undefined}
      >
        <SelectInput
          name="output"
          value={output}
          onChange={onChange}
        >
          <option value="null">--</option>
          {availableOutputs.map(({ id, name }) => (
            <option
              key={id}
              value={id}
            >
              {name}
            </option>
          ))}
        </SelectInput>
      </InlineFormGroup>
    </>
  );
}
