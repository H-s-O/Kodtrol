import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { isFunction, set } from 'lodash';
import { Button, Form, ControlLabel, Glyphicon, Modal, FormGroup, FormControl, Col, Table } from 'react-bootstrap';

class AddDevice extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      name: null,
      groups: null,
      type: null,
      startChannel: null,
      channels: [],
    };
  }

  resetFields() {
    this.setState({
      name: null,
      groups: null,
      type: null,
      startChannel: null,
      channels: [],
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

  onGroupChange(e) {
    this.setState({
      groups: e.target.value,
    });
  }

  onTypeChange(e) {
    this.setState({
      type: e.target.value,
    });
  }

  onStartChannelChange(e) {
    this.setState({
      startChannel: e.target.value,
    });
  }

  onAddChannelClick() {
    const { channels } = this.state;
    this.setState({
      channels: [
        ...channels,
        {
          defaultValue: null,
          alias: null,
        },
      ],
    });
  }

  onChannelChange(e, index, field) {
    const value = e.target.value;
    const channels = set(this.state.channels, `[${index}].${field}`, value);
    this.setState({
      channels,
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
      const { name, type, groups } = this.state;
      const data = {
        name,
        type,
        groups,
      };
      if (type === 'dmx') {
        const { channels, startChannel } = this.state;
        data.channels = channels;
        data.startChannel = startChannel;
      }
      onSuccess(data);
    }
  }

  render() {
    const { show } = this.props;
    const { type, channels } = this.state;
    return (
      <Modal
        show={show}
        onEnter={this.onEnter}
        keyboard
      >
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
                Device name
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
                Group(s)
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  type="text"
                  onChange={this.onGroupChange}
                />
              </Col>
            </FormGroup>
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Device type
              </Col>
              <Col
                componentClass={ControlLabel}
                sm={9}
              >
                <FormControl
                  componentClass="select"
                  onChange={this.onTypeChange}
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    --
                  </option>
                  <option
                    value="dmx"
                  >
                    DMX / ArtNet
                  </option>
                  <option
                    value="serial"
                  >
                    Serial
                  </option>
                </FormControl>
              </Col>
            </FormGroup>
            {type === 'dmx' && (
              <FormGroup
              >
                <Col
                  componentClass={ControlLabel}
                  sm={3}
                >
                  Starting channel
                </Col>
                <Col
                  sm={9}
                >
                  <FormControl
                    type="number"
                    onChange={this.onStartChannelChange}
                  />
                </Col>
              </FormGroup>
            )}
            {type === 'dmx' && (
              <FormGroup
              >
                <Col
                  componentClass={ControlLabel}
                  sm={3}
                >
                  Channel definitions
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
                      <th>Default value</th>
                      <th>Alias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.map((it, index) => (
                      <tr
                        key={`channel-${index}`}
                      >
                        <td>
                          {index + 1}
                        </td>
                        <td>
                          <FormControl
                            type="number"
                            bsSize="small"
                            onChange={(e) => this.onChannelChange(e, index, 'defaultValue')}
                          />
                        </td>
                        <td>
                          <FormControl
                            type="text"
                            bsSize="small"
                            onChange={(e) => this.onChannelChange(e, index, 'alias')}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan="3"
                      >
                        <Button
                          bsSize="xsmall"
                          onClick={this.onAddChannelClick}
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
            )}
            {type === 'serial' && (
              <FormGroup
              >
                <Col
                  componentClass={ControlLabel}
                  sm={3}
                >
                  Port
                </Col>
                <Col
                  sm={9}
                >
                  <FormControl
                    type="text"
                    onChange={this.onPortChange}
                  />
                </Col>
              </FormGroup>
            )}
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

export default AddDevice;
