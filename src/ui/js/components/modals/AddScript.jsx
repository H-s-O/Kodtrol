import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { isFunction } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class AddScript extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      name: null,
    };
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
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
      const { name } = this.state;
      onSuccess({
        name,
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
            placeholder="Enter new script name"
            onChange={this.onNameChange}
          />
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

export default AddScript;
