import React, { PureComponent } from 'react';
import { GithubPicker } from 'react-color';

export default class ColorField extends PureComponent {
  onFieldChange = (value) => {
    const { onChange } = this.props;
    const { hex } = value;
    onChange(hex);
  }

  render = () => {
    const { value, onChange, ...otherProps } = this.props;
    const finalValue = value ? value.toUpperCase() : '';

    return (
      <GithubPicker
        triangle="hide"
        width="100%"
        {...otherProps}
        color={finalValue}
        onChangeComplete={this.onFieldChange}
      />
    );
  }
}







