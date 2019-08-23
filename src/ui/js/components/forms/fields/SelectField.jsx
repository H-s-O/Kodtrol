import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class SelectField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange } = this.props;
    const newValue = e.target.value === '' ? null : e.target.value;
    onChange(newValue);
  }

  render = () => {
    const { options, hideEmpty, emptyLabel, value, ...otherProps } = this.props;
    const finalValue = value ? value : '';

    return (
      <FormControl
        {...otherProps}
        componentClass="select"
        value={finalValue}
        onChange={this.onFieldChange}
      >
        {!hideEmpty ? (
          <option value="">{emptyLabel || '(none)'}</option>
        ) : null}
        {options.map(({ label, value }, index) => (
          <option key={`option-${index}`} value={value}>{label}</option>
        ))}
      </FormControl>
    );
  }
}