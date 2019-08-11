import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class SelectField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange } = this.props;
    const value = e.target.value;
    onChange(value);
  }

  render = () => {
    const { options, hideEmpty, ...otherProps } = this.props;

    return (
      <FormControl
        {...otherProps}
        componentClass="select"
        onChange={this.onFieldChange}
      >
        {!hideEmpty ? (
          <option value="">--</option>
        ) : null}
        {options.map(({ label, value }, index) => (
          <option key={`option-${index}`} value={value}>{label}</option>
        ))}
      </FormControl>
    );
  }
}