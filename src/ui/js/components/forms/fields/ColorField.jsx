import React, { PureComponent } from 'react';
import { GithubPicker } from 'react-color';

export default class ColorField extends PureComponent {
  onFieldChange = (value) => {
    const { onChange } = this.props;
    const { hex } = value;
    onChange(hex);
  }
  
  render = () => {
    const { value, defaultValue, ...otherProps} = this.props;
    const finalValue = value || defaultValue ? (value || defaultValue).toUpperCase() : '';
    
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







