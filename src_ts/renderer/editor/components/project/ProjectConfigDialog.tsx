import React, { useCallback, useState, useMemo, MouseEventHandler } from 'react';
import { Button, Tabs, Tab, Card, Intent, Tag } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import uniqid from 'uniqid';

import CustomDialog from '../ui/CustomDialog';
import DialogBody from '../ui/DialogBody';
import DialogFooter from '../ui/DialogFooter';
import DialogFooterActions from '../ui/DialogFooterActions';
import { hideConfigDialogAction } from '../../store/actions/dialogs';
import InlineFormGroup from '../ui/InlineFormGroup';
import TextInput from '../ui/inputs/TextInput';
import NumberInput from '../ui/inputs/NumberInput';
import SelectInput from '../ui/inputs/SelectInput';
import ManagedTree from '../ui/ManagedTree';
import { saveInputsAction } from '../../store/actions/inputs';
import { saveOutputsAction } from '../../store/actions/outputs';
import { IO, IOType, IO_LABELS } from '../../../../common/constants';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { ok } from 'assert';
import { inputValidator } from '../../validators/inputValidators';
import { outputValidator } from '../../validators/outputValidators';

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
`;

const StyledLeftColumn = styled.div`
  width: 400px;
  margin-right: 10px;
`

const StyledRightColumn = styled.div`
  width: 100%;
`

const StyledAddButton = styled(({ withMargin, ...otherProps }) => <Button {...otherProps} />)`
  ${({ withMargin }) => withMargin && `
    margin-top: 10px;
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

const SingleInput = ({ value, onChange, availableItems }) => {
  const {
    name = null,
    type = null,
    protocol = null,
    port = null,
    device = null,
  } = value;

  const midiInputs = useMemo(
    () => availableItems.filter(({ type }) => type === IOType.MIDI),
    [availableItems]
  );

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
          <option value={IOType.OSC}>{IO_LABELS[IOType.OSC]}</option>
          <option value={IOType.MIDI}>{IO_LABELS[IOType.MIDI]}</option>
        </SelectInput>
      </InlineFormGroup>
      {type === IOType.OSC && (
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
      {type === IOType.MIDI && (
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
            {midiInputs.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
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

const getIldaDriverHelper = (driver) => {
  switch (driver) {
    case 'ether-dream':
      return 'For a Ether Dream network DAC.';
      break;
    case 'laserdock':
      return 'For a Laserdock/Lasercube USB DAC.';
      break;
  }

  return null;
}

const SingleOutput = ({ value, onChange, availableItems }) => {
  const {
    name = null,
    type = null,
    driver = null,
    port = null,
    address = null,
    dacRate = null,
  } = value;

  const midiOutputs = useMemo(() => availableItems.filter(({ type }) => type === IOType.MIDI), [availableItems]);

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
          <option value={IOType.DMX}>{IO_LABELS[IOType.DMX]}</option>
          <option value={IOType.ARTNET}>{IO_LABELS[IOType.ARTNET]}</option>
          <option value={IOType.ILDA}>{IO_LABELS[IOType.ILDA]}</option>
          <option value={IOType.MIDI}>{IO_LABELS[IOType.MIDI]}</option>
          <option value={IOType.AUDIO}>{IO_LABELS[IOType.AUDIO]}</option>
        </SelectInput>
      </InlineFormGroup>
      {type === IOType.DMX && (
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
      {type === IOType.ILDA && (
        <>
          <InlineFormGroup
            label="Driver"
            helperText={!driver ? 'An ILDA output driver is mandatory.' : getIldaDriverHelper(driver)}
            intent={!driver ? Intent.DANGER : undefined}
          >
            <SelectInput
              name="driver"
              value={driver}
              onChange={changeHandler}
            >
              <option value="null">--</option>
              <option value="ether-dream">Ether Dream</option>
              <option value="laserdock">Laserdock</option>
            </SelectInput>
          </InlineFormGroup>
          {driver === 'ether-dream' && (
            <InlineFormGroup
              label="Address"
              helperText="If no address is specified, Kodtrol will use the first Ether Dream detected on your network."
            >
              <TextInput
                name="address"
                value={address}
                onChange={changeHandler}
              />
            </InlineFormGroup>
          )}
          <InlineFormGroup
            label="Rate"
            helperText="DAC rate, in thousands of points per second (kpps)."
            intent={!dacRate ? Intent.DANGER : undefined}
          >
            <NumberInput
              name="dacRate"
              min={0}
              value={dacRate}
              onChange={changeHandler}
            />
          </InlineFormGroup>
        </>
      )}
      {type === IOType.ARTNET && (
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
      {type === IOType.MIDI && (
        <InlineFormGroup
          label="Device"
          helperText={!driver ? 'You must select a MIDI output device.' : undefined}
          intent={!driver ? Intent.DANGER : undefined}
        >
          <SelectInput
            name="driver"
            value={driver}
            onChange={changeHandler}
          >
            <option value="null">--</option>
            {midiOutputs.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </SelectInput>
        </InlineFormGroup>
      )}
    </Card>
  )
};

const getItemListName = (name: string): string => {
  return name ? name : '[no name]';
};

const ItemsPanel = ({
  value,
  onAdd,
  onChange,
  onDelete,
  onSelect,
  itemComponent: ItemComponent,
  listSecondaryLabelComponent: ListSecondaryLabelComponent,
  availableItems,
  selectedItemId = null,
}) => {
  const nodeClickHandler = useCallback(({ id }) => {
    onSelect(id);
  }, [onSelect]);

  const currentItem = value.find((item) => item.id === selectedItemId);
  const treeItems = value.map(({ id, name, type }) => ({
    id,
    key: id,
    isSelected: id === selectedItemId,
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
            withMargin={value && value.length > 0}
            onClick={onAdd}
          />
        </StyledLeftColumn>
        <StyledRightColumn>
          {currentItem && (
            <ItemComponent
              value={currentItem}
              onChange={onChange}
              onDelete={onDelete}
              availableItems={availableItems}
            />
          )}
        </StyledRightColumn>
      </StyledContainer>
    </Card>
  );
};

export default function ProjectConfigDialog() {
  const dialogOpen = useKodtrolSelector((state) => state.dialogs.configDialogOpened);
  const inputs = useKodtrolSelector((state) => state.inputs);
  const outputs = useKodtrolSelector((state) => state.outputs);
  const devices = useKodtrolSelector((state) => state.devices);
  const ioAvailable = useKodtrolSelector((state) => state.ioAvailable);

  const availableInputs = useMemo(() => {
    return ioAvailable.filter(({ mode }) => mode === IO.INPUT);
  }, [ioAvailable]);
  const availableOutputs = useMemo(() => {
    return ioAvailable.filter(({ mode }) => mode === IO.OUTPUT);
  }, [ioAvailable]);

  const [currentInputs, setInputs] = useState(inputs);
  const [currentOutputs, setOutputs] = useState(outputs);
  const [selectedInputId, setSelectedInputId] = useState(inputs && inputs.length > 0 ? inputs[0].id : null)
  const [selectedOutputId, setSelectedOutputId] = useState(outputs && outputs.length > 0 ? outputs[0].id : null)

  const addInputHandler = useCallback(() => {
    const newId = uniqid();
    setInputs([...currentInputs, { id: newId }]);
    setSelectedInputId(newId);
  }, [currentInputs]);
  const changeInputHandler = useCallback((value) => {
    setInputs(currentInputs.map((item) => item.id === value.id ? value : item));
  }, [currentInputs]);
  const addOutputHandler = useCallback(() => {
    const newId = uniqid();
    setOutputs([...currentOutputs, { id: newId }]);
    setSelectedOutputId(newId);
  }, [currentOutputs]);
  const changeOutputHandler = useCallback((value) => {
    setOutputs(currentOutputs.map((item) => item.id === value.id ? value : item));
  }, [currentOutputs]);
  const deleteInputHandler = useCallback((id) => {
    const input = currentInputs.find((item) => item.id === id);
    ok(input, 'input not found');
    const message = `Delete input "${getItemListName(input.name)}"?`;

    window.kodtrol_editor.deleteWarningDialog(message)
      .then((result) => {
        if (result) {
          const newInputs = currentInputs.filter((item) => item.id !== id);
          setInputs(newInputs);
          setSelectedInputId(newInputs.length > 0 ? newInputs[0].id : null);
        }
      });
  }, [currentInputs]);
  const deleteOutputHandler = useCallback((id) => {
    const output = currentOutputs.find((item) => item.id === id);
    ok(output, 'output not found');
    const devicesUsing = devices.filter(({ output }) => output === id);
    const message = `Delete output "${getItemListName(output.name)}"?`;
    const detail = devicesUsing.length > 0 ? `This output is used by ${devicesUsing.length} device(s).` : undefined;

    window.kodtrol_editor.deleteWarningDialog(message, detail)
      .then((result) => {
        if (result) {
          const newOutputs = currentOutputs.filter((item) => item.id !== id);
          setOutputs(newOutputs);
          setSelectedOutputId(newOutputs.length > 0 ? newOutputs[0].id : null);
        }
      });
  }, [currentOutputs, devices]);
  const selectInputHander = useCallback((id) => {
    setSelectedInputId(id);
  }, []);
  const selectOutputHander = useCallback((id) => {
    setSelectedOutputId(id);
  }, []);

  const dispatch = useKodtrolDispatch();
  const closeHandler: MouseEventHandler = useCallback(() => {
    dispatch(hideConfigDialogAction());
  }, [dispatch]);
  const applyHandler: MouseEventHandler = useCallback(() => {
    dispatch(saveInputsAction(currentInputs));
    dispatch(saveOutputsAction(currentOutputs));
  }, [dispatch, currentInputs, currentOutputs]);
  const successHandler: MouseEventHandler = useCallback(() => {
    dispatch(saveInputsAction(currentInputs));
    dispatch(saveOutputsAction(currentOutputs));
    dispatch(hideConfigDialogAction());
  }, [dispatch, currentInputs, currentOutputs]);

  const allValid = currentInputs.map(inputValidator).every(({ __all_fields }) => __all_fields === true)
    && currentOutputs.map(outputValidator).every(({ __all_fields }) => __all_fields === true);

  return (
    <CustomDialog
      minWidth={900}
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
            id="inputs"
            title="Inputs"
            panel={(
              <ItemsPanel
                value={currentInputs}
                onAdd={addInputHandler}
                onChange={changeInputHandler}
                onDelete={deleteInputHandler}
                onSelect={selectInputHander}
                itemComponent={SingleInput}
                listSecondaryLabelComponent={ItemSecondaryLabel}
                availableItems={availableInputs}
                selectedItemId={selectedInputId}
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
                onSelect={selectOutputHander}
                itemComponent={SingleOutput}
                listSecondaryLabelComponent={ItemSecondaryLabel}
                availableItems={availableOutputs}
                selectedItemId={selectedOutputId}
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
