import React, { useCallback, useState } from 'react';
import { Button, Tabs, Tab, Card, Intent, Classes, Tree, Tag } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import uniqid from 'uniqid';

import CustomDialog from '../ui/CustomDialog';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideConfigDialogAction } from '../../../../common/js/store/actions/dialogs';
import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import SelectInput from '../ui/inputs/SelectInput';
import { IO_DMX, IO_ILDA, IO_OSC, IO_MIDI, IO_LABELS } from '../../../../common/js/constants/io';
import ManagedTree from '../ui/ManagedTree';

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
`;

const StyledLeftColumn = styled.div`
  width: 250px;
  margin-right: 10px;
`

const StyledRightColumn = styled.div`
  width: 100%;
`

const StyledAddButton = styled(Button)`
  .${Classes.TAB} + & {
    margin-top: 10px;
  }
`;

const SingleInput = ({ value, onChange }) => {
  const {
    name = null,
    type = null,
  } = value;

  const changeHandler = useCallback((newValue, field) => {
    onChange({ ...value, [field]: newValue });
  }, [onChange, value]);

  return (
    <Card>
      <InlineFormGroup
        label="Name"
        helperText={!name ? 'An input name is mandatory.' : undefined}
        intent={!name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={changeHandler}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Type"
        helperText={!type ? 'An input type is mandatory.' : undefined}
        intent={!type ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="type"
          value={type}
          onChange={changeHandler}
        >
          <option value="null">--</option>
          <option value={IO_OSC}>OSC</option>
          <option value={IO_MIDI}>MIDI</option>
        </SelectInput>
      </InlineFormGroup>
    </Card>
  )
};

const getDmxDriverHelper = (driver) => {
  switch (driver) {
    case 'bbdmx':
      return 'For a BeagleBone-DMX interface.';
      break;
    case 'dmx4all':
      return 'For DMX4ALL devices like the "NanoDMX USB Interface".';
      break;
    case 'enttec-usb-dmx-pro':
      return 'For "Enttec USB DMX Pro" or devices using a similar chip like the "DMXKing ultraDMX Micro".';
      break;
    case 'enttec-open-usb-dmx':
      return 'For "Enttec Open DMX USB". This device is NOT recommended, there are known hardware limitations and this driver is not very stable.';
      break;
    case 'dmxking-utra-dmx-pro':
      return 'For the DMXKing Ultra DMX pro interface.';
      break;
  }

  return null;
}

const OutputSecondaryLabel = ({ type }) => {
  if (!type) {
    return null;
  }

  return (
    <Tag
      minimal
    >
      {IO_LABELS[type]}
    </Tag>
  );
}

const SingleOutput = ({ value, onChange }) => {
  const {
    name = null,
    type = null,
    driver = null,
    port = null,
  } = value;

  const changeHandler = useCallback((newValue, field) => {
    onChange({ ...value, [field]: newValue });
  }, [onChange, value]);

  return (
    <Card>
      <InlineFormGroup
        label="Name"
        helperText={!name ? 'An output name is mandatory.' : undefined}
        intent={!name ? Intent.DANGER : undefined}
      >
        <TextInput
          name="name"
          value={name}
          onChange={changeHandler}
        />
      </InlineFormGroup>
      <InlineFormGroup
        label="Type"
        helperText={!type ? 'An output type is mandatory.' : undefined}
        intent={!type ? Intent.DANGER : undefined}
      >
        <SelectInput
          name="type"
          value={type}
          onChange={changeHandler}
        >
          <option value="null">--</option>
          <option value={IO_DMX}>DMX</option>
          <option value={IO_ILDA}>ILDA</option>
        </SelectInput>
      </InlineFormGroup>
      {type === IO_DMX && (
        <>
          <InlineFormGroup
            label="Driver"
            helperText={!driver ? 'An DMX output driver is mandatory.' : getDmxDriverHelper(driver)}
            intent={!driver ? Intent.DANGER : driver === 'enttec-open-usb-dmx' ? Intent.WARNING : undefined}
          >
            <SelectInput
              name="driver"
              value={driver}
              onChange={changeHandler}
            >
              <option value="null">--</option>
              <option value="bbdmx">BeagleBone-DMX</option>
              <option value="dmx4all">DMX4ALL</option>
              <option value="enttec-usb-dmx-pro">Enttec USB DMX Pro</option>
              <option value="enttec-open-usb-dmx">Enttec Open DMX USB</option>
              <option value="dmxking-utra-dmx-pro">DMXKing Ultra DMX pro</option>
            </SelectInput>
          </InlineFormGroup>
          {driver && (
            <InlineFormGroup
              label="Port"
              helperText={!port ? 'An DMX output port is mandatory.' : undefined}
              intent={!port ? Intent.DANGER : undefined}
            >
              <TextInput
                name="port"
                value={port}
                onChange={changeHandler}
              />
            </InlineFormGroup>
          )}
        </>
      )}
    </Card>
  )
};

const getItemListName = (name) => {
  return name ? name : '[no name]';
}

const ItemsPanel = ({
  id,
  value,
  onAdd,
  onChange,
  itemComponent: ItemComponent,
  listSecondaryLabelComponent: ListSecondaryLabelComponent,
}) => {
  const [currentItemId, setCurrentItemId] = useState(null);

  const nodeClickHandler = useCallback(({ id }) => {
    setCurrentItemId(id);
  });

  const currentItem = value.find((item) => item.id == currentItemId);
  const treeItems = value.map(({ id, name, type }) => ({
    id,
    key: id,
    isSelected: id === currentItemId,
    label: getItemListName(name),
    secondaryLabel: ListSecondaryLabelComponent ? (
      <ListSecondaryLabelComponent
        id={id}
        name={name}
        type={type}
      />
    ) : undefined,
  }));

  return (
    <Card>
      <StyledContainer>
        <StyledLeftColumn>
          <ManagedTree
            items={treeItems}
            onNodeClick={nodeClickHandler}
          />
          <StyledAddButton
            fill
            small
            icon="plus"
            onClick={onAdd}
          />
        </StyledLeftColumn>
        <StyledRightColumn>
          {currentItem && (
            <ItemComponent
              value={currentItem}
              onChange={onChange}
            />
          )}
        </StyledRightColumn>
      </StyledContainer>
    </Card>
  );
};

export default function ProjectConfigDialog() {
  const dialogOpen = useSelector((state) => state.dialogs.configDialogOpened);
  const inputs = useSelector((state) => state.inputs);
  const outputs = useSelector((state) => state.outputs);

  const [currentInputs, setInputs] = useState(inputs);
  const [currentOutputs, setOutputs] = useState(outputs);
  const addInputHandler = useCallback(() => {
    setInputs([...currentInputs, { id: uniqid() }]);
  }, [currentInputs]);
  const changeInputHandler = useCallback((value) => {
    setInputs(currentInputs.map((item) => item.id === value.id ? value : item));
  }, [currentInputs]);
  const addOutputHandler = useCallback(() => {
    setOutputs([...currentOutputs, { id: uniqid() }]);
  }, [currentOutputs]);
  const changeOutputHandler = useCallback((value) => {
    setOutputs(currentOutputs.map((item) => item.id === value.id ? value : item));
  }, [currentOutputs]);

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
            panel={(
              <ItemsPanel
                id="inputs"
                value={currentInputs}
                onAdd={addInputHandler}
                onChange={changeInputHandler}
                itemComponent={SingleInput}
              />
            )}
          />
          <Tab
            id="outputs"
            title="Outputs"
            panel={(
              <ItemsPanel
                id="outputs"
                value={currentOutputs}
                onAdd={addOutputHandler}
                onChange={changeOutputHandler}
                itemComponent={SingleOutput}
                listSecondaryLabelComponent={OutputSecondaryLabel}
              />
            )}
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
