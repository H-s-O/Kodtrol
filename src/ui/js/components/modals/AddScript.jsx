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

class AddScript extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      name: null,
      devices: [],
    };
  }

  resetFields() {
    this.setState({
      name: null,
      devices: [],
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

  onAddDeviceClick() {
    const { devices } = this.state;
    this.setState({
      devices: [
        ...devices,
        {
          id: null,
        },
      ],
    });
  }

  onDeviceChange(e, index, field) {
    const value = e.target.value;
    const devices = set(this.state.devices, `[${index}].${field}`, value);
    this.setState({
      devices,
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
      const { name, devices } = this.state;
      onSuccess({
        name,
        devices,
      });
    }
  }

  render() {
    const { show, devices: sourceDevices } = this.props;
    const { devices } = this.state;
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
          Add script
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
                Script name
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
                Associated devices
              </Col>
              <Col
                sm={9}
              >
              <Table
                striped
                bordered
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Device</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((it, index) => (
                    <tr
                      key={`device-${index}`}
                    >
                      <td>
                        {index + 1}
                      </td>
                      <td>
                        <FormControl
                          componentClass="select"
                          bsSize="small"
                          onChange={(e) => this.onDeviceChange(e, index, 'id')}
                          defaultValue=""
                        >
                          <option
                            value=""
                            disabled
                          >
                            --
                          </option>
                          {sourceDevices.map((it, index) => (
                            <option
                              key={`device-${index}`}
                              value={it.id}
                            >
                              { it.label }
                            </option>
                          ))}
                        </FormControl>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan="2"
                    >
                      <Button
                        bsSize="xsmall"
                        onClick={this.onAddDeviceClick}
                      >
                        <Glyphicon
                          glyph="plus"
                        />
                      </Button>
                    </td>
                  </tr>
                </tbody>
                </Table>
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

AddScript.propTypes = propTypes;
AddScript.defaultProps = defaultProps;

export default AddScript;
