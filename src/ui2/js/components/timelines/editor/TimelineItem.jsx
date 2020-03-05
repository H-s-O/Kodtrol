import React from 'react';
import styled from 'styled-components';
import Color from 'color';

import percentString from '../../../lib/percentString';
import { ITEM_TRIGGER } from '../../../../../common/js/constants/items';

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
  position: absolute;
  height: 100%;
  border-radius: 4px;
  color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
  background-color: ${({ color }) => color};
  border-color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
`;

const PointLabel = styled.div`
  position: absolute;
  padding: 4px;
  font-size: 0.75em;
  background-color: inherit;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const PointContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: ${({ color }) => color};
  overflow-x: hidden;

  &:hover {
    overflow-x: visible;
    z-index: 10;
  }
`;

export default function TimelineItem({ item, scriptsNames, timelineDuration, ...otherProps }) {
  const { id, name, type, color, inTime, outTime, script } = item;

  if (type === ITEM_TRIGGER) {
    return (
      <PointContainer
        color={color}
        style={{
          left: percentString(inTime / timelineDuration),
        }}
        {...otherProps}
      >
        <PointLabel>{name}</PointLabel>
      </PointContainer>
    );
  }

  return (
    <BlockContainer
      color={color}
      style={{
        left: percentString(inTime / timelineDuration),
        width: percentString((outTime - inTime) / timelineDuration),
      }}
      {...otherProps}
    >
      <BlockHeader>
        <BlockLabel>{name || scriptsNames[script]}</BlockLabel>
      </BlockHeader>
    </BlockContainer>
  );
}
