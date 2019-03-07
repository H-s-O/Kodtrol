import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { set } from 'lodash';
import { connect } from 'react-redux';
import { Modal, Tabs, Tab, Row, Col, Nav, NavItem, Panel, ListGroup, ListGroupItem, Well, Button, Glyphicon, Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import uniqid from 'uniqid';

import isFunction from '../../lib/isFunction';
import openExternalUrl from '../../../../common/js/lib/openExternalUrl';

import styles from '../../../styles/components/modals/configmodal.scss';

const propTypes = {
  show: PropTypes.bool,
  outputs: PropTypes.arrayOf(PropTypes.shape({})),
  inputs: PropTypes.arrayOf(PropTypes.shape({})),
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
};

const defaultProps = {
  show: false,
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
      currentOutput: outputs && outputs.length ? outputs[0].id : null,
      currentInput: inputs && inputs.length ? inputs[0].id : null,
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
  
  onAddOutput = () => {
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
  
  onSelectOutput = (id) => {
    this.setState({
      currentOutput: id,
    });
  }
  
  updateOutput = (id, path, e) => {
    const value = e.target.value;
    
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
  
  onAddInput = () => {
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
  
  onSelectInput = (id) => {
    this.setState({
      currentInput: id,
    });
  }
  
  updateInput = (id, path, e) => {
    const value = e.target.value;
    
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
                onClick={this.onAddOutput}
              >
                <Glyphicon glyph="plus" />
              </Button>
            </Panel.Heading>
            <ListGroup
              >
              { outputs.map(({id, name}) => {
                return (
                  <ListGroupItem
                    key={id}
                    active={id === currentOutput}
                    onClick={() => this.onSelectOutput(id)}
                  >
                    <Glyphicon glyph="log-out" /> { name || "(unamed)" }
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Panel>
        </Col>
        <Col
          sm={8}
        >
          { currentOutput ? (
            <Well>
              <Form
                horizontal
              >
                { this.renderOutputForm(currentOutput) }
              </Form>
            </Well>
          ) : (
            <h4 className="text-center">No outputs</h4>
          ) }
        </Col>
      </Row>
    );
  }
  
  renderOutputForm = (outputId) => {
    const { outputs } = this.state;
    const output = outputs.find(({id}) => id === outputId);
    const { id, name, type, extraData } = output;
    
    return (
      <Fragment>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Name
          </Col>
          <Col md={10}>
            <FormControl type="text" value={name || ''} onChange={(e) => this.updateOutput(id, 'name', e)} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Type
          </Col>
          <Col md={10}>
            <FormControl componentClass="select" value={type} onChange={(e) => this.updateOutput(id, 'type', e)} >
              <option value="">--</option>
              <option value="dmx">DMX</option>
              <option value="artnet">ArtNet</option>
            </FormControl>
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
                <FormControl componentClass="select" value={extraData.subType} onChange={(e) => this.updateOutput(id, 'extraData.subType', e)} >
                  <option value="">--</option>
                  <option value="bbdmx">BeagleBone-DMX</option>
                  <option value="dmx4all">DMX4ALL</option>
                  <option value="enttec-usb-dmx-pro">Enttec USB DMX Pro</option>
                  <option value="enttec-open-usb-dmx">Enttec Open DMX USB</option>
                  <option value="dmxking-utra-dmx-pro">DMXKing Ultra DMX pro</option>
                </FormControl>
                <HelpBlock>
                  { this.renderOutputTypeHelp(extraData.subType) }
                </HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Port
              </Col>
              <Col md={10}>
                <FormControl type="text" value={extraData.port || ''} onChange={(e) => this.updateOutput(id, 'extraData.port', e)} />
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
                <FormControl type="text" value={extraData.address || ''} onChange={(e) => this.updateOutput(id, 'extraData.address', e)} />
              </Col>
            </FormGroup>
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
  
  renderOutputTypeHelp = (subType) => {
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
                onClick={this.onAddInput}
              >
                <Glyphicon glyph="plus" />
              </Button>
            </Panel.Heading>
            <ListGroup
              >
              { inputs.map(({id, name}) => {
                return (
                  <ListGroupItem
                    key={id}
                    active={id === currentInput}
                    onClick={() => this.onSelectInput(id)}
                  >
                    <Glyphicon glyph="log-in" /> { name || "(unamed)" }
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Panel>
        </Col>
        <Col
          sm={8}
        >
          { currentInput ? (
            <Well>
              <Form
                horizontal
              >
                { this.renderInputForm(currentInput) }
              </Form>
            </Well>
          ) : (
            <h4 className="text-center">No inputs</h4>
          ) }
        </Col>
      </Row>
    );
  }
  
  renderInputForm = (inputId) => {
    const { inputs } = this.state;
    const input = inputs.find(({id}) => id === inputId);
    const { id, name, type, extraData } = input;
    
    return (
      <Fragment>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Name
          </Col>
          <Col md={10}>
            <FormControl type="text" value={name || ''} onChange={(e) => this.updateInput(id, 'name', e)} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col md={2} componentClass={ControlLabel}>
            Type
          </Col>
          <Col md={10}>
            <FormControl componentClass="select" value={type} onChange={(e) => this.updateInput(id, 'type', e)} >
              <option value="">--</option>
              <option value="midi">MIDI</option>
              <option value="osc">OSC</option>
            </FormControl>
          </Col>
        </FormGroup>
        <hr />
        { type === 'osc' ? (
          <Fragment>
            <FormGroup>
              <Col md={2} componentClass={ControlLabel}>
                Port
              </Col>
              <Col md={10}>
                <FormControl type="text" value={extraData.port || ''} onChange={(e) => this.updateInput(id, 'extraData.port', e)} />
                <HelpBlock>
                  { this.renderInputAddressAndPortHelp(extraData.port) }
                </HelpBlock>
              </Col>
            </FormGroup>
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
  
  renderInputAddressAndPortHelp = (port) => {
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

const mapStateToProps = ({outputs, inputs}) => {
  return {
    outputs,
    inputs,
  };
}

export default connect(mapStateToProps)(ConfigModal);