import React, { useCallback } from 'react';
import { Button, Tabs, Tab, Card, Intent } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';

import CustomDialog from '../ui/CustomDialog';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideConfigDialogAction } from '../../../../common/js/store/actions/dialogs';
import FullWidthVerticalTabs from '../ui/FullWidthVerticalTabs';
import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';

const SingleInput = () => {
  return (
    <Card>
      <InlineFormGroup
        label="Name"
        helperText={true ? 'An input name is mandatory.' : undefined}
        intent={true ? Intent.DANGER : undefined}
      >
        <TextInput />
      </InlineFormGroup>
    </Card>
  )
};

const SingleOutput = () => {
  return (
    <Card>
      <p>Output here</p>
    </Card>
  )
};

const InputsPanel = () => {
  return (
    <Card>
      <FullWidthVerticalTabs
        id="input_list"
      >
        <Tab
          id="0"
          title="asiudaisd"
          panel={<SingleInput />}
        />
        <Tab
          id="1"
          title="ADAS87678"
          panel={<SingleInput />}
        />
        <Button
          fill
          small
          style={{ marginTop: '10px' }}
          icon="plus"
        />
      </FullWidthVerticalTabs>
    </Card>
  );
};

const OutputsPanel = () => {
  return (
    <Card>
      <FullWidthVerticalTabs
        id="output_list"
      >
        <Tab
          id="0"
          title="asiudaisd"
          panel={<SingleOutput />}
        />
        <Tab
          id="1"
          title="ADAS87678"
          panel={<SingleOutput />}
        />
      </FullWidthVerticalTabs>
    </Card>
  );
};

export default function ProjectConfigDialog() {
  const dialogOpen = useSelector((state) => state.dialogs.configDialogOpened);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideConfigDialogAction());
  }, [dispatch]);

  return (
    <CustomDialog
      minWidth={800}
      minHeight={600}
      isOpen={dialogOpen}
      title="Project Configuration"
      onClose={closeHandler}
    >
      <DialogBody>
        <Tabs
          large
          id="io"
        >
          <Tab
            id="inputs"
            title="Inputs"
            panel={<InputsPanel />}
          />
          <Tab
            id="outputs"
            title="Outputs"
            panel={<OutputsPanel />}
          />
        </Tabs>
      </DialogBody>
      <DialogFooter>
        <DialogFooterActions>
          <Button
            onClick={closeHandler}
          >
            Close
              </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
};
