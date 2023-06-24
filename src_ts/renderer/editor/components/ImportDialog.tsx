import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Button, Spinner, Intent } from '@blueprintjs/core';
import { ok } from 'assert';

import CustomDialog from './ui/CustomDialog';
import DialogBody from './ui/DialogBody';
import DialogFooter from './ui/DialogFooter';
import DialogFooterActions from './ui/DialogFooterActions';
import FileInput from './ui/inputs/FileInput';
import InlineFormGroup from './ui/InlineFormGroup';
import { getMediaName } from '../lib/helpers';
import MultiSelectInput from './ui/inputs/MultiSelectInput';
import { hideImportDialogAction, updateImportDialogAction } from '../store/actions/dialogs';
import { createDevicesAction } from '../store/actions/devices';
import { createScriptsAction } from '../store/actions/scripts';
import { createMediasAction } from '../store/actions/medias';
import { createTimelinesAction } from '../store/actions/timelines';
import { createBoardsAction } from '../store/actions/boards';
import { useKodtrolDispatch, useKodtrolSelector } from '../lib/hooks';
import { KodtrolState } from '../../../common/types';
import { mergeDialogBody } from '../lib/helpers';
import { importValidator } from '../validators/importValidators';
import { PROJECT_FILE_EXTENSION } from '../../../common/constants';
import { KodtrolDialogType } from '../constants';

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
  const dialogOpen = useKodtrolSelector((state) => state.dialogs.importDialogOpened);
  const dialogMode = useKodtrolSelector((state) => state.dialogs.importDialogMode)
  const dialogValue = useKodtrolSelector((state) => state.dialogs.importDialogValue);

  const bodyValue = dialogValue || defaultValue;
  const bodyValid = importValidator(bodyValue, dialogMode);
  const { devices, scripts, medias, timelines, boards } = bodyValue;

  const [file, setFile] = useState<string | null>(null);
  const [project, setProject] = useState<KodtrolState | null>(null);
  const [projectChanged, setProjectChanged] = useState(false);

  const dispatch = useKodtrolDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideImportDialogAction());
    setFile(null);
    setProject(null);
    setProjectChanged(false);
  }, [dispatch]);
  const successHandler = useCallback(() => {
    ok(dialogMode && project, 'dialogMode or project is not set');
    if (dialogMode & KodtrolDialogType.IMPORT_DEVICES && devices && devices.length > 0) {
      dispatch(createDevicesAction(project.devices.filter(({ id }) => devices.includes(id))));
    }
    if (dialogMode & KodtrolDialogType.IMPORT_SCRIPTS && scripts && scripts.length > 0) {
      dispatch(createScriptsAction(project.scripts.filter(({ id }) => scripts.includes(id))));
    }
    if (dialogMode & KodtrolDialogType.IMPORT_MEDIAS && medias && medias.length > 0) {
      dispatch(createMediasAction(project.medias.filter(({ id }) => medias.includes(id))));
    }
    if (dialogMode & KodtrolDialogType.IMPORT_TIMELINES && timelines && timelines.length > 0) {
      dispatch(createTimelinesAction(project.timelines.filter(({ id }) => timelines.includes(id))));
    }
    if (dialogMode & KodtrolDialogType.IMPORT_BOARDS && boards && boards.length > 0) {
      dispatch(createBoardsAction(project.boards.filter(({ id }) => boards.includes(id))));
    }
    dispatch(hideImportDialogAction());
    setFile(null);
    setProject(null);
    setProjectChanged(false);
  }, [dispatch, dialogMode, project, devices, scripts, medias, timelines, boards]);
  const changeHandler = useCallback((value, field) => {
    dispatch(updateImportDialogAction(mergeDialogBody(bodyValue, value, field)))
  }, [dispatch, bodyValue]);

  const fileChangeHandler = useCallback((value: string | null) => {
    if (value) {
      setFile(value);
      setProjectChanged(true);
    } else {
      setFile(null);
      setProject(null);
      setProjectChanged(false);
    }
  }, []);

  useEffect(() => {
    if (file && projectChanged) {
      window.kodtrol_editor.readProjectFile(file)
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
              {(dialogMode & KodtrolDialogType.IMPORT_DEVICES) ? (
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
              {(dialogMode & KodtrolDialogType.IMPORT_SCRIPTS) ? (
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
              {(dialogMode & KodtrolDialogType.IMPORT_MEDIAS) ? (
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
              {(dialogMode & KodtrolDialogType.IMPORT_TIMELINES) ? (
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
              {(dialogMode & KodtrolDialogType.IMPORT_BOARDS) ? (
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
            disabled={!bodyValid.__all_fields}
            onClick={successHandler}
          >
            Import
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
};
