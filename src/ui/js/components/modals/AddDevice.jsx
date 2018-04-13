import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { isFunction } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class AddDevice extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      name: null,
      type: null,
    };
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onTypeChange(e) {
    this.setState({
      type: e.target.value,
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
      const { name, type } = this.state;
      onSuccess({
        name,
        type,
      });
    }
  }

  render() {
    const { show } = this.props;
    return (
      <Modal
        show={show}
        bsSize="small"
        keyboard
      >
        <Modal.Body>
          <FormControl
            type="text"
            placeholder="Enter new device name"
            onChange={this.onNameChange}
          />
          <FormControl
            componentClass="select"
            onChange={this.onTypeChange}
            defaultValue=""
          >
            <option
              value=""
              disabled
            >
              Select device type
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
