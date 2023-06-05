import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
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
import { createDevicesAction } from '../../../common/js/store/actions/devices';
import { createScriptsAction } from '../../../common/js/store/actions/scripts';
import { createMediasAction } from '../../../common/js/store/actions/medias';
import { createTimelinesAction } from '../../../common/js/store/actions/timelines';
import { createBoardsAction } from '../../../common/js/store/actions/boards';

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
  const bodyValid = importValidator(bodyValue, dialogMode);
  const { devices, scripts, medias, timelines, boards } = bodyValue;

  const [file, setFile] = useState(null);
  const [project, setProject] = useState(null);
  const [projectChanged, setProjectChanged] = useState(false);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideImportDialogAction());
    setFile(null);
    setProject(null);
    setProjectChanged(false);
  }, [dispatch]);
  const successHandler = useCallback(() => {
    console.log(devices, scripts, medias, timelines, boards);
    if (dialogMode & DIALOG_IMPORT_DEVICES && devices && devices.length > 0) {
      dispatch(createDevicesAction(project.devices.filter(({ id }) => devices.includes(id))));
    }
    if (dialogMode & DIALOG_IMPORT_SCRIPTS && scripts && scripts.length > 0) {
      dispatch(createScriptsAction(project.scripts.filter(({ id }) => scripts.includes(id))));
    }
    if (dialogMode & DIALOG_IMPORT_MEDIAS && medias && medias.length > 0) {
      dispatch(createMediasAction(project.medias.filter(({ id }) => medias.includes(id))));
    }
    if (dialogMode & DIALOG_IMPORT_TIMELINES && timelines && timelines.length > 0) {
      dispatch(createTimelinesAction(project.timelines.filter(({ id }) => timelines.includes(id))));
    }
    if (dialogMode & DIALOG_IMPORT_BOARDS && boards && boards.length > 0) {
      dispatch(createBoardsAction(project.boards.filter(({ id }) => boards.includes(id))));
    }
    dispatch(hideImportDialogAction());
    setFile(null);
    setProject(null);
    setProjectChanged(false);
  }, [dispatch, project, devices, scripts, medias, timelines, boards]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateImportDialogAction(mergeDialogBody(bodyValue, value, field)))
  }, [dispatch, bodyValue]);

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
                    <MultiSelectInput
                      fill
                      name="scripts"
                      value={scripts}
                      onChange={changeHandler}
                      items={project.scripts.map(({ id, name }) => ({ label: name, value: id }))}
                      placeholder="Click to select..."
                    />
                  </InlineFormGroup>
                ) : null}
                {(dialogMode & DIALOG_IMPORT_MEDIAS) ? (
                  <InlineFormGroup
                    label="Media(s)"
                    minWidth={75}
                  >
                    <MultiSelectInput
                      fill
                      name="medias"
                      value={medias}
                      onChange={changeHandler}
                      items={project.medias.map((media) => ({ label: getMediaName(media), value: media.id }))}
                      placeholder="Click to select..."
                    />
                  </InlineFormGroup>
                ) : null}
                {(dialogMode & DIALOG_IMPORT_TIMELINES) ? (
                  <InlineFormGroup
                    label="Timeline(s)"
                    minWidth={75}
                  >
                    <MultiSelectInput
                      fill
                      name="timelines"
                      value={timelines}
                      onChange={changeHandler}
                      items={project.timelines.map(({ id, name }) => ({ label: name, value: id }))}
                      placeholder="Click to select..."
                    />
                  </InlineFormGroup>
                ) : null}
                {(dialogMode & DIALOG_IMPORT_BOARDS) ? (
                  <InlineFormGroup
                    label="Board(s)"
                    minWidth={75}
                  >
                    <MultiSelectInput
                      fill
                      name="boards"
                      value={boards}
                      onChange={changeHandler}
                      items={project.boards.map(({ id, name }) => ({ label: name, value: id }))}
                      placeholder="Click to select..."
                    />
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
            disabled={!bodyValid.all_fields}
            onClick={successHandler}
          >
            Import
            </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
};
