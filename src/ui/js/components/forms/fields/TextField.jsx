import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class TextField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange } = this.props;
    const newValue = e.target.value === '' ? null : e.target.value;
    onChange(newValue);
  }
  
  render = () => {
    const { value, ...otherProps } = this.props;
    const finalValue = value ? value : '';

    return (
      <FormControl
        {...otherProps}
        type="text"
        value={finalValue}
        onChange={this.onFieldChange}
      />
    );
  }
}