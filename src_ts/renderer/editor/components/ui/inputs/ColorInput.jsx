import React, { useCallback } from 'react';
import { SwatchesPicker } from 'react-color';
import styled from 'styled-components';
import { Colors } from '@blueprintjs/core';

const StyledSwatchesPicker = styled(SwatchesPicker)`
  & > div > div {
    background: ${Colors.DARK_GRAY2} !important;
    box-shadow: none !important;
  }

  & > div > div > div {
    overflow: hidden !important;
  }
`;

export default function ColorInput({ value, name, onChange, ...otherProps }) {
  const changeHandler = useCallback(({ hex }) => {
    if (typeof onChange === 'function') {
      onChange(hex, name);
    }
  }, [onChange, name]);

  const displayValue = value ? value.toUpperCase() : '';

  return (
    <StyledSwatchesPicker
      width="100%"
      height="80px"
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
      color={displayValue}
      onChangeComplete={changeHandler}
      {...otherProps}
    />
  );
}
