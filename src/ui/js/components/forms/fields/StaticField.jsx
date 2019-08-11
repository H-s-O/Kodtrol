import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class StaticField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange } = this.props;
    const value = e.target.value;
    onChange(value);
  }
  
  render = () => {
    const {defaultValue} = this.props;
    return (
      <FormControl.Static>
          { defaultValue }
      </FormControl.Static>
    );
  }
}