import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Tabs, Tab, Row, Col, Nav, NavItem, Panel, ListGroup, ListGroupItem, Well, Button, Glyphicon, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import isFunction from '../../lib/isFunction';

import styles from '../../../styles/components/modals/configmodal.scss';

const propTypes = {
  show: PropTypes.bool,
  outputs: PropTypes.arrayOf(PropTypes.shape({})),
  inputs: PropTypes.arrayOf(PropTypes.shape({})),
  onClose: PropTypes.func,
};

const defaultProps = {
  show: false,
  outputs: [],
  inputs: [],
  onClose: null,
};

class ConfigModal extends Component {
  renderOutputsConfig = () => {
    const { outputs } = this.props;
    
    return (
      <Row>
        <Col
          sm={4}
        >
          <Panel>
            <Panel.Heading>
              <Button
                bsSize="xsmall" 
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
                  >
                    { name || "(unamed)" }
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Panel>
        </Col>
        <Col
          sm={8}
        >
          <Well>
            <Form
              horizontal
            >
              <FormGroup>
                <Col md={2} componentClass={ControlLabel}>
                  Name
                </Col>
                <Col md={10}>
                  <FormControl type="text" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col md={2} componentClass={ControlLabel}>
                  Type
                </Col>
                <Col md={10}>
                  <FormControl componentClass="select">
                    <option value="dmx">DMX</option>
                    <option value="artnet">ArtNet</option>
                  </FormControl>
                </Col>
              </FormGroup>
            </Form>
          </Well>
        </Col>
      </Row>
    );
  }
  
  renderOutput = (data) => {
    
  }
  
  renderInputsConfig = () => {
    return (
      <p>sadasdsa</p>
    );
  }
  
  render = () => {
    const { show, onClose } = this.props;
    
    return (
      <Modal
        show={show}
        keyboard
        bsSize="large"
        onHide={onClose}
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
            defaultActiveKey="outputs"
            animation={false}
            justified
            >
            <Tab
              eventKey="outputs"
              title="Outputs"
              className={styles.tabContent}
              >
              { this.renderOutputsConfig() }
            </Tab>
            <Tab
              eventKey="inputs"
              title="Inputs"
              className={styles.tabContent}
              >
              { this.renderInputsConfig() }
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
          >
            Cancel
          </Button>
          <Button
            bsStyle="info"
          >
            Apply
          </Button>
          <Button
            bsStyle="success"
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

const mapStateToProps = ({outputs}) => {
  return {
    outputs,
  };
}

export default connect(mapStateToProps)(ConfigModal);