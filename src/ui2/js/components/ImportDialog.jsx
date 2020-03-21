import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner, Intent } from '@blueprintjs/core';
import { readJson } from 'fs-extra';
import { useSelector, useDispatch } from 'react-redux';

import CustomDialog from './ui/CustomDialog';
import DialogBody from './ui/DialogBody';
import DialogFooter from './ui/DialogFooter';
import DialogFooterActions from './ui/DialogFooterActions';
import FileInput from './ui/inputs/FileInput';
import InlineFormGroup from './ui/InlineFormGroup';
import { PROJECT_FILE_EXTENSION } from '../../../common/js/constants/app';
import styled from 'styled-components';
import SelectInput from './ui/inputs/SelectInput';
import { getMediaName } from '../../../common/js/lib/itemNames';
import MultiSelectInput from './ui/inputs/MultiSelectInput';
import {
  DIALOG_IMPORT_DEVICES,
  DIALOG_IMPORT_SCRIPTS,
  DIALOG_IMPORT_MEDIAS,
  DIALOG_IMPORT_TIMELINES,
  DIALOG_IMPORT_BOARDS,
} from '../../../common/js/constants/dialogs';
import { hideImportDialogAction, updateImportDialogAction } from '../../../common/js/store/actions/dialogs';
import mergeDialogBody from '../../../common/js/lib/mergeDialogBody';
import importValidator from '../../../common/js/validators/importValidator';

const StyledSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const defaultValue = {
  devices: null,
  scripts: null,
  medias: null,
  timelines: null,
  boards: null,
};

export default function ImportDialog() {
  const dialogOpen = useSelector((state) => state.dialogs.importDialogOpened);
  const dialogMode = useSelector((state) => state.dialogs.importDialogMode);
  const dialogValue = useSelector((state) => state.dialogs.importDialogValue);

  const bodyValue = dialogValue || defaultValue;
  const bodyValid = importValidator(bodyValue);
  const { devices } = bodyValue;

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideImportDialogAction());
  }, [dispatch]);
  const successHandler = useCallback(() => {
    // @TODO
  }, [dispatch]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateImportDialogAction(mergeDialogBody(bodyValue, value, field)))
  }, [dispatch, bodyValue]);

  const [file, setFile] = useState(null);
  const [project, setProject] = useState(null);
  const [projectChanged, setProjectChanged] = useState(false);

  const fileChangeHandler = useCallback((value) => {
    if (value) {
      setFile(value);
      setProjectChanged(true);
    } else {
      setFile(null);
      setProject(null);
      setProjectChanged(false);
    }
  });

  useEffect(() => {
    if (file && projectChanged) {
      readJson(file)
        .then((data) => {
          setProject(data);
          setProjectChanged(false);
        })
        .catch((err) => {
          console.error(err);
          setProjectChanged(false);
        });
    }
  }, [file]);

  return (
    <CustomDialog
      isOpen={dialogOpen}
      title="Import from project"
      icon="import"
      onClose={closeHandler}
    >
      <DialogBody>
        <InlineFormGroup
          label="Project file"
          minWidth={75}
        >
          <FileInput
            fill
            inputProps={{
              accept: `.${PROJECT_FILE_EXTENSION}`,
            }}
            value={file}
            onChange={fileChangeHandler}
          />
        </InlineFormGroup>
        {file && (
          !project ? (
            <StyledSpinnerContainer>
              <Spinner />
            </StyledSpinnerContainer>
          ) : (
              <>
                {(dialogMode & DIALOG_IMPORT_DEVICES) ? (
                  <InlineFormGroup
                    label="Device(s)"
                    minWidth={75}
                  >
                    <MultiSelectInput
                      fill
                      name="devices"
                      value={devices}
                      onChange={changeHandler}
                      items={project.devices.map(({ id, name }) => ({ label: name, value: id }))}
                      placeholder="Click to select..."
                    />
                  </InlineFormGroup>
                ) : null}
                {(dialogMode & DIALOG_IMPORT_SCRIPTS) ? (
                  <InlineFormGroup
                    label="Script(s)"
                    minWidth={75}
                  >
                    <SelectInput>
                      {project.scripts.map(({ id, name, type }) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </SelectInput>
                  </InlineFormGroup>
                ) : null}
                {(dialogMode & DIALOG_IMPORT_MEDIAS) ? (
                  <InlineFormGroup
                    label="Media(s)"
                    minWidth={75}
                  >
                    <SelectInput>
                      {project.medias.map((media) => (
                        <option key={media.id} value={media.id}>{getMediaName(media)}</option>
                      ))}
                    </SelectInput>
                  </InlineFormGroup>
                ) : null}
                {(dialogMode & DIALOG_IMPORT_TIMELINES) ? (
                  <InlineFormGroup
                    label="Timeline(s)"
                    minWidth={75}
                  >
                    <SelectInput>
                      {project.timelines.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </SelectInput>
                  </InlineFormGroup>
                ) : null}
                {(dialogMode & DIALOG_IMPORT_BOARDS) ? (
                  <InlineFormGroup
                    label="Board(s)"
                    minWidth={75}
                  >
                    <SelectInput>
                      {project.boards.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </SelectInput>
                  </InlineFormGroup>
                ) : null}
              </>
            )
        )}
      </DialogBody>
      <DialogFooter>
        <DialogFooterActions>
          <Button
            onClick={closeHandler}
          >
            Cancel
            </Button>
          <Button
            intent={Intent.SUCCESS}
            disabled={!bodyValid}
            onClick={successHandler}
          >
            Import
            </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
};
