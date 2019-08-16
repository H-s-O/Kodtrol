import React, { PureComponent } from 'react';
import { SwatchesPicker } from 'react-color';

import styles from '../../../../styles/components/forms/fields/colorfield.scss';

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
      <SwatchesPicker
        width="100%"
        height="80px"
        className={styles.swatchesPickerAdjust}
        {...otherProps}
        colors={[
          ['#B80000', '#EB9694'],
          ['#DB3E00', '#FAD0C3'],
          ['#FCCB00', '#FEF3BD'],
          ['#008B02', '#C1E1C5'],
          ['#006B76', '#BEDADC'],
          ['#1273DE', '#C4DEF6'],
          ['#004DCF', '#BED3F3'],
          ['#5300EB', '#D4C4FB'],
        ]}
        color={finalValue}
        onChangeComplete={this.onFieldChange}
      />
    );
  }
}
