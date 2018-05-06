import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import { isFunction, set } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table } from 'react-bootstrap';

const propTypes = {
  initialValue: PropTypes.shape({}),
  mode: PropTypes.string,
};

const defaultProps = {
  initialValue: null,
  mode: 'add',
};

class AddTimeline extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      name: null,
      tempo: 0,
    };
  }

  resetFields() {
    this.setState({
      name: null,
      tempo: 0,
    });
  }

  onEnter() {
    this.resetFields();
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onTempoChange(e) {
    this.setState({
      tempo: e.target.value,
    });
  }

  onCancelClick() {
    const { onCancel } = this.props;
    if (isFunction(onCancel)) {
      onCancel();
    }
  }

  onSaveClick() {
    const { onSuccess } = this.props;
    if (isFunction(onSuccess)) {
      const { name, tempo } = this.state;
      onSuccess({
        name,
        tempo,
      });
    }
  }

  render() {
    const { show } = this.props;
    return (
      <Modal
        show={show}
        onEnter={this.onEnter}
        keyboard
      >
      <Modal.Header
      >
        <Modal.Title
        >
          Add timeline
        </Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Form
            horizontal
          >
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Name
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  type="text"
                  onChange={this.onNameChange}
                />
              </Col>
            </FormGroup>
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Tempo
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  type="number"
                  onChange={this.onTempoChange}
                />
              </Col>
            </FormGroup>
          </Form>
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

AddTimeline.propTypes = propTypes;
AddTimeline.defaultProps = defaultProps;

export default AddTimeline;
