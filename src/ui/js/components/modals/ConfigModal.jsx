import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { set } from 'lodash';
import { connect } from 'react-redux';
import { Modal, Tabs, Tab, Row, Col, Nav, NavItem, Panel, ListGroup, ListGroupItem, Well, Button, Glyphicon, Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import uniqid from 'uniqid';

import TreeView from '../partials/TreeView';
import stopEvent from '../../lib/stopEvent';
import openExternalUrl from '../../../../common/js/lib/openExternalUrl';
import { deleteWarning } from '../../lib/messageBoxes';
import TextField from '../forms/fields/TextField';
import NumberField from '../forms/fields/NumberField';
import SelectField from '../forms/fields/SelectField';

import styles from '../../../styles/components/modals/configmodal.scss';

const propTypes = {
  show: PropTypes.bool,
  devices: PropTypes.arrayOf(PropTypes.shape({})),
  outputs: PropTypes.arrayOf(PropTypes.shape({})),
  inputs: PropTypes.arrayOf(PropTypes.shape({})),
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
};

const defaultProps = {
  show: false,
  devices: [],
  outputs: [],
  inputs: [],
  onCancel: null,
  onSuccess: null,
};

class ConfigModal extends Component {
  state = {
    currentOutput: null,
    currentInput: null,
    outputs: [],
    inputs: [],
  };
  
  onEnter = () => {
    const { inputs, outputs } = this.props;
    this.setState({
      inputs,
      outputs,
      currentOutput: outputs.length > 0 ? outputs[0].id : null,
      currentInput: inputs.length > 0 ? inputs[0].id : null,
    });
  }
  
  onCancelClick = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  onSaveClick = () => {
    const { onSuccess } = this.props;
    const { outputs, inputs } = this.state;
    onSuccess({
      outputs,
      inputs,
    });
  }
  
  onAddOutputClick = () => {
    const { outputs } = this.state;
    const id = uniqid();
    const newOutputs = [
      ...outputs,
      {
        id,
        extraData: {},
      },
    ];
    
    this.setState({
      outputs: newOutputs,
      currentOutput: id,
    });
  }
  
  onDeleteOutputClick = (outputId) => {
    const { devices } = this.props;
    const { outputs } = this.state;
    const outputObj = outputs.find(({id}) => id === outputId);
    const devicesUsing = devices.filter(({output}) => output === outputId);
    const message = `Delete output "${outputObj.name || '(unamed)'}"?`;
    const detail = devicesUsing.length > 0 ? `This output is used by ${devicesUsing.length} device(s).` : null;
    
    if (deleteWarning(message, detail, (result) => {
      if (result) {
        this.doDeleteOutput(outputId);
      }
    }));
  }
  
  doDeleteOutput = (outputId) => {
    const { outputs } = this.state;
    const newOutputs = outputs.filter(({id}) => id !== outputId);
    const newCurrentOutput = newOutputs.length > 0 ? newOutputs[0].id : null;
    
    this.setState({
      currentOutput: newCurrentOutput,
      outputs: newOutputs,
    });
  }
  
  onSelectOutput = (it) => {
    const { id } = it;
    this.setState({
      currentOutput: id,
    });
  }
  
  updateOutput = (id, path, value) => {
    const { outputs } = this.state;
    const newOutputs = [
      ...outputs.map((output) => {
        if (output.id === id) {
          const newOutput = {
            ...output,
          };
          set(newOutput, path, value);
          return newOutput;
        }
        return output;
      }),
    ];

    this.setState({
      outputs: newOutputs,
    });
  }
  
  onAddInputClick = () => {
    const { inputs } = this.state;
    const id = uniqid();
    const newInputs = [
      ...inputs,
      {
        id,
        extraData: {},
      },
    ];
    
    this.setState({
      inputs: newInputs,
      currentInput: id,
    });
  }
  
  onDeleteInputClick = (inputId) => {
    const { inputs } = this.state;
    const inputObj = inputs.find(({id}) => id === inputId);
    const message = `Delete input "${inputObj.name}"?`;
    
    deleteWarning(message, (result) => {
      if (result) {
        this.doDeleteInput(inputId);
      }
    });
  }
  
  doDeleteInput = (inputId) => {
    const { inputs } = this.state;
    const newInputs = inputs.filter(({id}) => id !== inputId);
    const newCurrentInput = newInputs.length > 0 ? newInputs[0].id : null;
    
    this.setState({
      currentInput: newCurrentInput,
      inputs: newInputs,
    });
  }
  
  onSelectInput = (it) => {
    const { id } = it;
    this.setState({
      currentInput: id,
    });
  }
  
  updateInput = (id, path, value) => {
    const { inputs } = this.state;
    const newInputs = [
      ...inputs.map((input) => {
        if (input.id === id) {
          const newInput = {
            ...input,
          };
          set(newInput, path, value);
          return newInput;
        }
        return input;
      }),
    ];

    this.setState({
      inputs: newInputs,
    });
  }
  
  renderOutputsConfig = () => {
    const { outputs, currentOutput } = this.state;
    
    return (
      <Row>
        <Col
          sm={4}
        >
          <Panel>
            <Panel.Heading>
              <Button
                bsSize="xsmall"
                onClick={this.onAddOutputClick}
              >
                <Glyphicon glyph="plus" />
              </Button>
            </Panel.Heading>
            <TreeView
              value={outputs.map(({id, name}) => ({
                id,
                label: name || '(unamed)',
                icon: 'log-out',
                active: id === currentOutput,
              }))}
              onClickItem={this.onSelectOutput}
              renderActions={this.renderOutputActions}
            />
          </Panel>
        </Col>
        <Col
          sm={8}
        >
          <Well>
            { outputs.length > 0 && currentOutput ? (
                <Form
                  horizontal
                >
                  { this.renderOutputForm(currentOutput) }
                </Form>
            ) : (
              <h4 className="text-center">No outputs</h4>
            ) }
          </Well>
        </Col>
      </Row>
    );
  }
  
  renderOutputActions = (it) => {
    return (
      <Button
        bsSize="xsmall"
        bsStyle="danger"
        onClick={(e) => { stopEvent(e); this.onDeleteOutputClick(it.id); }}
      >
        <Glyphicon glyph="trash" />
      </Button>
    )
  }
  
  renderOutputForm = (outputId) => {
    const { outputs } = this.state;
    const output = outputs.find(({id}) => id === outputId);
    if (!output) {
      return null;
    }
    
    const { id, name, type, extraData } = output;
    
    return (
      <Fragment>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Name
          </Col>
          <Col md={10}>
            <TextField value={name || ''} onChange={(value) => this.updateOutput(id, 'name', value)} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Type
          </Col>
          <Col md={10}>
            <SelectField value={type || ''} onChange={(value) => this.updateOutput(id, 'type', value)} options={[
              { value: 'dmx', label: 'USB DMX' },
              { value: 'artnet', label: 'ArtNet' },
              { value: 'ilda', label: 'ILDA' },
              { value: 'audio', label: 'Audio' },
            ]} />
          </Col>
        </FormGroup>
        <hr />
        { type === 'dmx' ? (
          <Fragment>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Driver
              </Col>
              <Col md={10}>
                <SelectField value={extraData.subType || ''} onChange={(value) => this.updateOutput(id, 'extraData.subType', value)} options={[
                  { value: 'bbdmx', label: 'BeagleBone-DMX' },
                  { value: 'dmx4all', label: 'DMX4ALL' },
                  { value: 'enttec-usb-dmx-pro', label: 'Enttec USB DMX Pro' },
                  { value: 'enttec-open-usb-dmx', label: 'Enttec Open DMX USB' },
                  { value: 'dmxking-utra-dmx-pro', label: 'DMXKing Ultra DMX pro' },
                ]} />
                <HelpBlock>
                  { this.renderDmxOutputTypeHelp(extraData.subType) }
                </HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Port
              </Col>
              <Col md={10}>
                <TextField value={extraData.port || ''} onChange={(value) => this.updateOutput(id, 'extraData.port', value)} />
              </Col>
            </FormGroup>
          </Fragment>
        ) : type === 'artnet' ? (
          <Fragment>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Address
              </Col>
              <Col md={10}>
                <TextField value={extraData.address || ''} onChange={(value) => this.updateOutput(id, 'extraData.address', value)} />
              </Col>
            </FormGroup>
          </Fragment>
        ) : type === 'ilda' ? (
          <Fragment>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Driver
              </Col>
              <Col md={10}>
                <SelectField value={extraData.subType || ''} onChange={(value) => this.updateOutput(id, 'extraData.subType', value)} options={[
                  { value: 'ether-dream', label: 'Ether Dream' },
                  { value: 'helios', label: 'Helios' },
                  { value: 'laserdock', label: 'Laserdock' },
                  { value: 'beyond', label: 'Pangolin Beyond' },
                  { value: 'easylase', label: 'Easylase' },
                ]} />
                <HelpBlock>
                  { this.renderIldaOutputTypeHelp(extraData.subType) }
                </HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Address
              </Col>
              <Col md={10}>
                <TextField value={extraData.address || ''} onChange={(value) => this.updateOutput(id, 'extraData.address', value)} />
              </Col>
            </FormGroup>
          </Fragment>
        ) : type === 'audio' ? (
          <Fragment>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Device
              </Col>
              <Col md={10}>
                <SelectField value={extraData.device || ''} onChange={(value) => this.updateOutput(id, 'extraData.device', value)} options={[
                  { value: 'default', label: 'System default' },
                ]} />
              </Col>
            </FormGroup>
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
  
  renderDmxOutputTypeHelp = (subType) => {
    switch (subType) {
      case 'bbdmx':
        return (<Fragment>For a <a href="#" onClick={() => openExternalUrl('https://github.com/boxysean/beaglebone-DMX')}>BeagleBone-DMX</a> interface</Fragment>);
        break;
      case 'dmx4all':
        return 'For DMX4ALL devices like the "NanoDMX USB Interface"';
        break;
      case 'enttec-usb-dmx-pro':
        return 'For devices using a Enttec USB DMX Pro chip like the "DMXKing ultraDMX Micro"';
        break;
      case 'enttec-open-usb-dmx':
        return 'For "Enttec Open DMX USB". This device is NOT recommended, there are known hardware limitations and this driver is not very stable.';
        break;
      case 'dmxking-utra-dmx-pro':
        return 'For the DMXKing Ultra DMX pro interface';
        break;
    }
    
    return null;
  }
  
  renderIldaOutputTypeHelp = (subType) => {
    switch (subType) {
      case 'ether-dream':
        return (<Fragment>For a <a href="#" onClick={() => openExternalUrl('https://ether-dream.com/')}>Ether Dream</a> DAC</Fragment>);
        break;
        case 'helios':
        return (<Fragment>For a <a href="#" onClick={() => openExternalUrl('http://pages.bitlasers.com/helios/')}>Helios</a> DAC</Fragment>);
        break;
        case 'laserdock':
        return (<Fragment>For a <a href="#" onClick={() => openExternalUrl('https://www.wickedlasers.com/laserdock')}>Laserdock</a> laser</Fragment>);
        break;
        case 'beyond':
        return (<Fragment>For use with the <a href="#" onClick={() => openExternalUrl('https://pangolin.com/pages/beyond')}>Pangolin Beyond</a> software (Windows only)</Fragment>);
        break;
        case 'easylase':
        return (<Fragment>For a <a href="#" onClick={() => openExternalUrl('http://www.jmlaser.com/EasyLase_D.htm')}>Easylase</a> DAC (Windows only)</Fragment>);
        break;
    }
    
    return null;
  }
  
  renderInputsConfig = () => {
    const { inputs, currentInput } = this.state;
    
    return (
      <Row>
        <Col
          sm={4}
        >
          <Panel>
            <Panel.Heading>
              <Button
                bsSize="xsmall"
                onClick={this.onAddInputClick}
              >
                <Glyphicon glyph="plus" />
              </Button>
            </Panel.Heading>
            <TreeView
              value={inputs.map(({id, name}) => ({
                id,
                label: name || '(unamed)',
                icon: 'log-in',
                active: id === currentInput,
              }))}
              onClickItem={this.onSelectInput}
              renderActions={this.renderInputActions}
            />
          </Panel>
        </Col>
        <Col
          sm={8}
        >
        <Well>
            { inputs.length > 0 && currentInput ? (
                <Form
                  horizontal
                >
                  { this.renderInputForm(currentInput) }
                </Form>
            ) : (
              <h4 className="text-center">No inputs</h4>
            ) }
          </Well>
        </Col>
      </Row>
    );
  }
  
  renderInputActions = (it) => {
    return (
      <Button
        bsSize="xsmall"
        bsStyle="danger"
        onClick={(e) => { stopEvent(e); this.onDeleteInputClick(it.id); }}
      >
        <Glyphicon glyph="trash" />
      </Button>
    )
  }
  
  renderInputForm = (inputId) => {
    const { inputs } = this.state;
    const input = inputs.find(({id}) => id === inputId);
    if (!input) {
      return null;
    }
    
    const { id, name, type, extraData } = input;
    
    return (
      <Fragment>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Name
          </Col>
          <Col md={10}>
            <TextField value={name || ''} onChange={(value) => this.updateInput(id, 'name', value)} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Type
          </Col>
          <Col md={10}>
            <SelectField value={type || ''} onChange={(value) => this.updateInput(id, 'type', value)} options={[
              { value: 'midi', label: 'MIDI' },
              { value: 'osc', label: 'OSC' },
            ]} />
          </Col>
        </FormGroup>
        <hr />
        { type === 'osc' ? (
          <Fragment>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Protocol
              </Col>
              <Col md={10}>
                <SelectField value={extraData.subType || ''} onChange={(value) => this.updateInput(id, 'extraData.subType', value)} options={[
                  { value: 'tcp', label: 'TCP Socket' },
                  { value: 'udp', label: 'UDP' },
                ]} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Port
              </Col>
              <Col md={10}>
                <NumberField value={extraData.port || ''} onChange={(value) => this.updateInput(id, 'extraData.port', value)} />
                <HelpBlock>
                  { this.renderOscInputAddressAndPortHelp(extraData.port) }
                </HelpBlock>
              </Col>
            </FormGroup>
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
  
  renderOscInputAddressAndPortHelp = (port) => {
    const fullAddress = `[local ip/hostname here]:${port}`;
    return `This input will be reachable at ${fullAddress}`;
  }
  
  render = () => {
    const { show, onCancel } = this.props;
    
    return (
      <Modal
        show={show}
        keyboard
        bsSize="large"
        onHide={onCancel}
        onEnter={this.onEnter}
        backdrop="static"
      >
        <Modal.Header
          closeButton
        >
          <Modal.Title>
            Configuration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            id="config-tabs"
            defaultActiveKey="inputs"
            animation={false}
            justified
            >
            <Tab
              eventKey="inputs"
              title="Inputs"
              className={styles.tabContent}
              >
              { this.renderInputsConfig() }
            </Tab>
            <Tab
              eventKey="outputs"
              title="Outputs"
              className={styles.tabContent}
              >
              { this.renderOutputsConfig() }
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onCancelClick}
          >
            Cancel
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onSaveClick}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfigModal.propTypes = propTypes;
ConfigModal.defaultProps = defaultProps;

const mapStateToProps = ({outputs, inputs, devices}) => {
  return {
    outputs,
    inputs,
    devices,
  };
}

export default connect(mapStateToProps)(ConfigModal);