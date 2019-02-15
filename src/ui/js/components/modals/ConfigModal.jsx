import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tabs, Tab, Row, Col, Nav, NavItem, Panel, ListGroup, ListGroupItem, Well, Button, Glyphicon } from 'react-bootstrap';

import isFunction from '../../lib/isFunction';

const propTypes = {
  show: PropTypes.bool,
  outputs: PropTypes.arrayOf(PropTypes.shape({})),
  onClose: PropTypes.func,
};

const defaultProps = {
  show: false,
  outputs: [],
  onClose: null,
};

class ConfigModal extends Component {
  renderOutputsConfig = () => {
    return (
      <Tab.Container
        id="outputs-list"
        defaultActiveKey="first"
      >
        <Row className="clearfix">
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
                bsStyle="pills"
                >
                <ListGroupItem eventKey="first">Tab 1</ListGroupItem>
                <ListGroupItem eventKey="second">Tab 2</ListGroupItem>
              </ListGroup>
            </Panel>
          </Col>
          <Col
            sm={8}
          >
            <Tab.Content
              animation={false}
            >
              <Tab.Pane eventKey="first">
                <Well>
                  salas;das;l
                </Well>
              </Tab.Pane>
              <Tab.Pane eventKey="second">Tab 2 content</Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
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
      >
        <Modal.Header
          closeButton
        >
          <Modal.Title>
            Config
          </Modal.Title>
        </Modal.Header>
        <Tabs
          id="config-tabs"
          defaultActiveKey="outputs"
          animation={false}
          justified
        >
          <Tab
            eventKey="outputs"
            title="Outputs"
          >
            { this.renderOutputsConfig() }
          </Tab>
          <Tab
            eventKey="inputs"
            title="Inputs"
          >
            { this.renderInputsConfig() }
          </Tab>
        </Tabs>
      </Modal>
    );
  }
}

ConfigModal.propTypes = propTypes;
ConfigModal.defaultProps = defaultProps;

export default ConfigModal;