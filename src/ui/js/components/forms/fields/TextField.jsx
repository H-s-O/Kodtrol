import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class TextField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange } = this.props;
    const value = e.target.value;
    onChange(value);
  }
  
  render = () => {
    return (
      <FormControl
        type="text"
        {...this.props}
        onChange={this.onFieldChange}
      />
    );
  }
}