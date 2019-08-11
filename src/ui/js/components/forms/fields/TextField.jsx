import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class TextField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange } = this.props;
    const value = e.target.value;
    onChange(value);
  }
  
  render = () => {
    const { value, ...otherProps } = this.props;
    const finalValue = value ? value : '';

    return (
      <FormControl
        type="text"
        {...otherProps}
        value={finalValue}
        onChange={this.onFieldChange}
      />
    );
  }
}