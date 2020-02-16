import React, { useCallback, useState } from 'react';
import { Button, Tabs, Tab, Card, Intent, Tag } from '@blueprintjs/core';
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
import NumberInput from '../ui/inputs/NumberInput';
import SelectInput from '../ui/inputs/SelectInput';
import { IO_DMX, IO_ILDA, IO_OSC, IO_MIDI, IO_LABELS, IO_ARTNET, IO_AUDIO } from '../../../../common/js/constants/io';
import ManagedTree from '../ui/ManagedTree';
import inputValidator from '../../../../common/js/validators/inputValidator';
import outputValidator from '../../../../common/js/validators/outputValidator';
import { deleteWarning } from '../../../../ui/js/lib/messageBoxes';
import { saveInputsAction } from '../../../../common/js/store/actions/inputs';
import { saveOutputsAction } from '../../../../common/js/store/actions/outputs';

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
  ${({ margin }) => margin && `
    & {
      margin-top: 10px;
    }
  `}
`;

const ItemSecondaryLabel = ({ id, type, onDelete }) => {
  const deleteClickHandler = useCallback((e) => {
    e.stopPropagation();
    onDelete(id);
  }, [id, onDelete]);

  return (
    <>
      {type && (
        <Tag
          minimal
        >
          {IO_LABELS[type]}
        </Tag>
      )}
      <Button
        small
        minimal
        icon="trash"
        intent={Intent.DANGER}
        onClick={deleteClickHandler}
      />
    </>
  );
}

const SingleInput = ({ value, onChange }) => {
  const {
    name = null,
    type = null,
    protocol = null,
    port = null,
    device = null,
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
          <option value={IO_OSC}>{IO_LABELS[IO_OSC]}</option>
          <option value={IO_MIDI}>{IO_LABELS[IO_MIDI]}</option>
        </SelectInput>
      </InlineFormGroup>
      {type === IO_OSC && (
        <>
          <InlineFormGroup
            label="Protocol"
            helperText={!protocol ? 'An OSC input protocol is mandatory.' : undefined}
            intent={!protocol ? Intent.DANGER : undefined}
          >
            <SelectInput
              name="protocol"
              value={protocol}
              onChange={changeHandler}
            >
              <option value="null">--</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
            </SelectInput>
          </InlineFormGroup>
          <InlineFormGroup
            label="Port"
            helperText={!port ? 'An OSC input port is mandatory.' : undefined}
            intent={!port ? Intent.DANGER : undefined}
          >
            <NumberInput
              name="port"
              min={1024}
              max={65535}
              placeholder="1024 - 65535"
              value={port}
              onChange={changeHandler}
            />
          </InlineFormGroup>
        </>
      )}
      {type === IO_MIDI && (
        <InlineFormGroup
          label="Device"
          helperText={!device ? 'You must select a MIDI input device.' : undefined}
          intent={!device ? Intent.DANGER : undefined}
        >
          <SelectInput
            name="device"
            value={device}
            onChange={changeHandler}
          >
            <option value="null">--</option>
            <option value="asdasdasd">Device 1</option>
          </SelectInput>
        </InlineFormGroup>
      )}
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

const SingleOutput = ({ value, onChange }) => {
  const {
    name = null,
    type = null,
    driver = null,
    port = null,
    address = null,
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
          <option value={IO_DMX}>{IO_LABELS[IO_DMX]}</option>
          <option value={IO_ARTNET}>{IO_LABELS[IO_ARTNET]}</option>
          <option value={IO_ILDA}>{IO_LABELS[IO_ILDA]}</option>
          <option value={IO_AUDIO}>{IO_LABELS[IO_AUDIO]}</option>
        </SelectInput>
      </InlineFormGroup>
      {type === IO_DMX && (
        <>
          <InlineFormGroup
            label="Driver"
            helperText={!driver ? 'A DMX output driver is mandatory.' : getDmxDriverHelper(driver)}
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
              helperText={!port ? 'A DMX output port is mandatory.' : undefined}
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
      {(type === IO_ARTNET || type === IO_ILDA) && (
        <InlineFormGroup
          label="Address"
          helperText={!address ? 'An Art-Net output address is mandatory.' : undefined}
          intent={!address ? Intent.DANGER : undefined}
        >
          <TextInput
            name="address"
            value={address}
            onChange={changeHandler}
          />
        </InlineFormGroup>
      )}
    </Card>
  )
};

const getItemListName = (name) => {
  return name ? name : '[no name]';
}

const ItemsPanel = ({
  value,
  onAdd,
  onChange,
  onDelete,
  itemComponent: ItemComponent,
  listSecondaryLabelComponent: ListSecondaryLabelComponent,
}) => {
  const [currentItemId, setCurrentItemId] = useState(value && value.length > 0 ? value[0].id : null);

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
        onDelete={onDelete}
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
            margin={value && value.length > 0}
            onClick={onAdd}
          />
        </StyledLeftColumn>
        <StyledRightColumn>
          {currentItem && (
            <ItemComponent
              value={currentItem}
              onChange={onChange}
              onDelete={onDelete}
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
  const devices = useSelector((state) => state.devices);

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
  const deleteInputHandler = useCallback((id) => {
    const obj = currentInputs.find((item) => item.id === id);
    const message = `Delete input "${getItemListName(obj.name)}"?`;

    deleteWarning(message, (result) => {
      if (result) {
        setInputs(currentInputs.filter((item) => item.id !== id));
      }
    });
  }, [currentInputs]);
  const deleteOutputHandler = useCallback((id) => {
    const obj = currentOutputs.find((item) => item.id === id);
    const devicesUsing = devices.filter(({ output }) => output === id);
    const message = `Delete output "${getItemListName(obj.name)}"?`;
    const detail = devicesUsing.length > 0 ? `This output is used by ${devicesUsing.length} device(s).` : null;

    deleteWarning(message, detail, (result) => {
      if (result) {
        setOutputs(currentOutputs.filter((item) => item.id !== id));
      }
    });
  }, [currentOutputs, devices]);

  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(hideConfigDialogAction());
  }, [dispatch]);
  const applyHandler = useCallback(() => {
    dispatch(saveInputsAction(currentInputs));
    dispatch(saveOutputsAction(currentOutputs));
  }, [dispatch, currentInputs, currentOutputs]);
  const successHandler = useCallback(() => {
    dispatch(saveInputsAction(currentInputs));
    dispatch(saveOutputsAction(currentOutputs));
    dispatch(hideConfigDialogAction());
  }, [dispatch, currentInputs, currentOutputs]);

  const allValid = currentInputs.every(inputValidator) && currentOutputs.every(outputValidator);

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
          id="config"
          defaultSelectedTabId="inputs"
        >
          <Tab
            id="general"
            title="General"
            disabled
          />
          <Tab
            id="inputs"
            title="Inputs"
            panel={(
              <ItemsPanel
                value={currentInputs}
                onAdd={addInputHandler}
                onChange={changeInputHandler}
                onDelete={deleteInputHandler}
                itemComponent={SingleInput}
                listSecondaryLabelComponent={ItemSecondaryLabel}
              />
            )}
          />
          <Tab
            id="outputs"
            title="Outputs"
            panel={(
              <ItemsPanel
                value={currentOutputs}
                onAdd={addOutputHandler}
                onChange={changeOutputHandler}
                onDelete={deleteOutputHandler}
                itemComponent={SingleOutput}
                listSecondaryLabelComponent={ItemSecondaryLabel}
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
          <Button
            intent={Intent.PRIMARY}
            disabled={!allValid}
            onClick={applyHandler}
          >
            Apply
          </Button>
          <Button
            intent={Intent.SUCCESS}
            disabled={!allValid}
            onClick={successHandler}
          >
            Save
          </Button>
        </DialogFooterActions>
      </DialogFooter>
    </CustomDialog>
  );
};
