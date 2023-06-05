import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import Color from 'color';

import { ITEM_LABELS, ITEM_SCRIPT } from '../../../../../common/js/constants/items';
import blockPercentToOpacity from '../../../lib/blockPercentToOpacity';

const StyledBlockLabel = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  margin: 0px 2px;
`;

const StyledBlockHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 2px;
  width: 100%;
  font-size: 0.75em;
  border-bottom-color: inherit;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  overflow: hidden;
`;

const StyledBlockBody = styled.div`
  flex-grow: 1;
`;

const statusAnim = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 28px 0;
  }
`;

const StyledBlockStatus = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  ${({ active }) => active && css`
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'} 10px,
      ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'} 20px
    );
    background-size: 28px 28px;
    animation: ${statusAnim} .5s linear infinite;
  `}
`;

const StyledBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 3px;
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

const BoardScript = ({ script, scriptsNames, active, status, ...otherProps }) => {
  const { name, color, script: scriptId, behavior } = script;

  return (
    <StyledBlockContainer
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader>
        <StyledBlockLabel>
          {name || scriptsNames[scriptId]} [{ITEM_LABELS[behavior]}]
        </StyledBlockLabel>
      </StyledBlockHeader>
      <StyledBlockBody>
        <StyledBlockStatus
          color={color}
          active={true}
          style={{
            opacity: blockPercentToOpacity(status),
          }}
        />
      </StyledBlockBody>
    </StyledBlockContainer>
  );
};

export default function BoardItem({ item, scriptsNames, ...otherProps }) {
  const type = item.type;

  if (type === ITEM_SCRIPT) {
    return (
      <BoardScript
        script={item}
        scriptsNames={scriptsNames}
        {...otherProps}
      />
    );
  }

  // @TODO medias ?

  return null;
};
