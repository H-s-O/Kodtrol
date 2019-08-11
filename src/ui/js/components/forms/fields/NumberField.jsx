import React, { PureComponent } from 'react';

import TextField from './TextField';

export default class NumberField extends PureComponent {
  onFieldChange = (value) => {
    const { onChange } = this.props;
    onChange(Number(value)); // cast to Number
  }

  render = () => {
    const { value, ...otherProps } = this.props;
    const finalValue = value ? value : '0';

    return (
      <TextField
        {...otherProps}
        value={finalValue}
        type="number"
        onChange={this.onFieldChange}
      />
    );
  }
}