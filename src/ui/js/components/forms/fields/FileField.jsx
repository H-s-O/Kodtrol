import React, { PureComponent } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

import { importAudioFile } from '../../../lib/messageBoxes';

class FileField extends PureComponent {
  onSelectClick = () => {
    const files = importAudioFile();
    if (files && files.length) {
      const [firstFile] = files;
      this.onFieldChange(firstFile);
    }
  }

  onFieldChange = (value) => {
    const { onChange } = this.props;
    onChange(value);
  }

  render = () => {
    const { value } = this.props;
    const finalValue = value  ? value : '';

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