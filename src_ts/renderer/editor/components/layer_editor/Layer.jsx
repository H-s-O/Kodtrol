import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Colors } from '@blueprintjs/core';

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  background: ${Colors.DARK_GRAY2};
  flex-grow: 1;

  &:not(:first-child) {
    margin-bottom: 5px;
  }

  &:hover {
    background: ${Colors.DARK_GRAY3};
  }
`;

export default function Layer({ layer, onContextMenu, children, ...otherProps }) {
  const { id, order } = layer;
  const contextMenuHandler = useCallback((e) => {
    if (onContextMenu) {
      onContextMenu(e, id)
    }
  }, [onContextMenu, id]);

  return (
    <StyledContainer
      onContextMenu={contextMenuHandler}
      {...otherProps}
    >
      {children}
    </StyledContainer>
  );
}
