import React from 'react';
import styled from 'styled-components';
import Color from 'color';

const BlockLabel = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
`;

const BlockHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px;
  width: 100%;
  font-size: 0.75em;
  border-bottom-color: inherit;
  border-bottom-style: solid;
  border-bottom-width: 1px;
`;

const BlockContainer = styled.div`
  flex-grow: 1;
  border-radius: 4px;
  color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
  background-color: ${({ color }) => color};
  border-color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};

  &:not(:last-child) {
    margin-right: 5px;
  }

  &:hover, &.active {
    background-color: ${({ color }) => Color(color).lighten(0.1).rgb().string()};
  }
`;

export default function BoardItem({ item, scriptsNames, ...otherProps }) {
  const { id, name, color, script, media } = item;

  return (
    <BlockContainer
      color={color}
      {...otherProps}
    >
      <BlockHeader>
        <BlockLabel>
          {name || scriptsNames[script]}
        </BlockLabel>
      </BlockHeader>
    </BlockContainer>
  );
}
