import React, { PureComponent } from 'react';
import { set } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table, InputGroup } from 'react-bootstrap';

import { importAudioFile } from '../../../lib/messageBoxes';

class FileField extends PureComponent {
  state = {
    value: null,
  };
  
  constructor(props) {
    super(props);
    
    const { defaultValue } = props;
    if (defaultValue) {
      this.state = {
        value: defaultValue,
      };
    }
  }
  
  onSelectClick = () => {
    const files = importAudioFile();
    if (files && files.length) {
      this.doChange(files[0]);
    }
  }
  
  doChange = (value) => {
    this.setState({
      value,
    });
    
    const { onChange } = this.props;
    onChange(value);
  }
  
  render = () => {
    const { value } = this.state;
    
    return (
      <InputGroup>
        <InputGroup.Button>
          <Button
            bsStyle="info"
            onClick={this.onSelectClick}
          >
            Select
          </Button>
        </InputGroup.Button>
        <FormControl
          readOnly
          type="text"
          value={value}
        />
      </InputGroup>
    );
  }
}

export default FileField;