import React from 'react';
import styled from 'styled-components';

import percentString from '../../../lib/percentString';
import { ITEM_TRIGGER } from '../../../../../common/js/constants/items';

const BlockContainer = styled.div`
  position: absolute;
  height: 100%;
  border-radius: 4px;
`;

const PointContainer = styled.div`
  position: absolute;
  height: 100%;
  border-left-width: 1px;
  border-left-style: solid;
`

export default function TimelineItem({ item, timelineDuration }) {
  const { id, name, type, color, inTime, outTime } = item;

  if (type === ITEM_TRIGGER) {
    return (
      <PointContainer
        style={{
          left: percentString(inTime / timelineDuration),
          backgroundColor: color,
          borderColor: color,
        }}
      >
        <div
          className="label"
        >
          {name}
        </div>
      </PointContainer>
    );
  }

  return (
    <BlockContainer
      style={{
        left: percentString(inTime / timelineDuration),
        width: percentString((outTime - inTime) / timelineDuration),
        backgroundColor: color,
        borderColor: color,
      }}
    />
  );
}
