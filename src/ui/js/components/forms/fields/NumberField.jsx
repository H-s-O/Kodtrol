import React, { PureComponent } from 'react';

import TextField from './TextField';

export default class NumberField extends PureComponent {
  onFieldChange = (value) => {
    const { onChange } = this.props;
    onChange(Number(value)); // cast to Number
  }
  
  render = () => {
    return (
      <TextField
        {...this.props}
        type="number"
        onChange={this.onFieldChange}
      />
    );
  }
}