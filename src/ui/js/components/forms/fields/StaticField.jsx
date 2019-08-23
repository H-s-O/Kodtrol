import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class StaticField extends PureComponent {
  render = () => {
    const { value } = this.props;
    const finalValue = value ? value : '';

    return (
      <FormControl.Static>
        {finalValue}
      </FormControl.Static>
    );
  }
}