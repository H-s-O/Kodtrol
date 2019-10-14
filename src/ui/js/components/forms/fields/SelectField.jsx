import React, { PureComponent } from 'react';
import { FormControl } from 'react-bootstrap';

export default class SelectField extends PureComponent {
  onFieldChange = (e) => {
    const { onChange, options } = this.props;
    const newValue = e.target.value === '' ? null : options[parseInt(e.target.value)].value;
    onChange(newValue);
  }

  render = () => {
    const { options, hideEmpty, emptyLabel, value, ...otherProps } = this.props;
    const finalValue = value ? value : '';

    return (
      <FormControl
        {...otherProps}
        componentClass="select"
        value={options.findIndex(({ value: optionValue }) => optionValue == finalValue)}
        onChange={this.onFieldChange}
      >
        {!hideEmpty ? (
          <option value="">{emptyLabel || '(none)'}</option>
        ) : null}
        {options.map(({ label }, index) => (
          <option key={`option-${index}`} value={index}>{label}</option>
        ))}
      </FormControl>
    );
  }
}