import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Intent, Spinner } from '@blueprintjs/core';
import { useSelector } from 'react-redux';

import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import FileInput from '../ui/inputs/FileInput';
import SelectInput from '../ui/inputs/SelectInput';
import mediaInfo from '../../lib/mediaInfo';
import DurationInput from '../ui/inputs/DurationInput';
import { IO_AUDIO } from '../../../../common/js/constants/io';

export default function MediaDialogBody({ value, onChange }) {
  const {
    file,
    name,
    output,
    duration,
    codec,
  } = value;

  const outputs = useSelector((state) => state.outputs);
  const availableOutputs = useMemo(() => {
    return outputs.filter(({ type }) => type === IO_AUDIO)
  }, [outputs]);

  const [fileChanged, setFileChanged] = useState(false);

  const fileChangeHandler = useCallback((value) => {
    onChange({
      file: value,
      duration: null,
      codec: null,
    });
    setFileChanged(true);
  }, [onChange]);

  useEffect(() => {
    if (file && fileChanged) {
      mediaInfo(file)
        .then((info) => {
          const { streams } = info;
          const [firstStream] = streams;
          const { duration_ts, codec_long_name } = firstStream;
          onChange({
            duration: duration_ts,
            codec: codec_long_name,
          });
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
        helperText={!file ? 'A file is mandatory.' : undefined}
        intent={!file ? Intent.DANGER : undefined}
      >
        <FileInput
          fill
          name="file"
          inputProps={{
            accept: '.mp3,.wav',
          }}
          value={file}
          onChange={fileChangeHandler}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Duration"
      >
        {!file ? (
          <TextInput
            readOnly
            disabled
            leftIcon="info-sign"
            value="<unknown>"
          />
        ) : !duration ? (
          <Spinner
            size={Spinner.SIZE_SMALL}
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
        label="Codec"
      >
        {!file ? (
          <TextInput
            readOnly
            disabled
            leftIcon="info-sign"
            value="<unknown>"
          />
        ) : !codec ? (
          <Spinner
            size={Spinner.SIZE_SMALL}
          />
        ) : (
              <TextInput
                readOnly
                leftIcon="info-sign"
                value={codec}
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
