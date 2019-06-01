import React, { PureComponent } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

import { importAudioFile } from '../../../lib/messageBoxes';

class FileField extends PureComponent {
  onSelectClick = () => {
    const files = importAudioFile();
    if (files && files.length) {
      this.onFieldChange(files[0]);
    }
  }
  
  onFieldChange = (value) => {
    const { onChange } = this.props;
    onChange(value);
  }
  
  render = () => {
    const { value, defaultValue } = this.props;
    const finalValue = value || defaultValue ? value || defaultValue : '';
console.log(value, defaultValue);
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
          value={finalValue}
        />
      </InputGroup>
    );
  }
}

export default FileField;