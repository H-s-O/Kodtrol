import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap'

export default class NumberField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange } = this.props;
    const newValue = e.target.value === '' ? null : Number(e.target.value); // cast to Number
    onChange(newValue); 
  }

  render = () => {
    const { value, ...otherProps } = this.props;
    const finalValue = value === 0 ? '0' : value || '';

    return (
      <FormControl
        {...otherProps}
        type="number"
        value={finalValue}
        onChange={this.onFieldChange}
      />
    );
  }
}