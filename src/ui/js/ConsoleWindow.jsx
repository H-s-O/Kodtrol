import React, { useRef, useCallback, useEffect } from 'react';
import { ButtonGroup, Button, Colors } from '@blueprintjs/core';
import styled from 'styled-components';

import FullHeightCard from './components/ui/FullHeightCard';
import { ipcRendererListen, ipcRendererClear } from './lib/ipcRenderer';
import { SCRIPT_LOG } from '../../common/js/constants/events';

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledTopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

const StyledBottomRow = styled.div`
  flex-grow: 1;
  position: relative;
`;

const StyledConsoleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${Colors.DARK_GRAY1};
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;

  p {
    padding: 2px;
    margin-bottom: 2px;
    border-bottom: 1px solid ${Colors.DARK_GRAY2};
  }
`;

const getTime = (time) => {
  const date = new Date(time);
  const timestr = date.toTimeString().split(' ')[0];
  const millisstr = String(date.getMilliseconds()).padStart(3, '0');
  return `${timestr}.${millisstr}`;
}

export default function ConsoleWindow() {
  const ref = useRef();

  const clearClickHandler = useCallback(() => {
    if (ref.current) {
      ref.current.innerHTML = ''; // yolo
    }
  }, [ref]);

  const logHandler = useCallback((e, { time, data }) => {
    if (ref.current) {
      const newLog = document.createElement('p');
      newLog.innerText = `${getTime(time)} > ${data}`;

      ref.current.appendChild(newLog);

      if (ref.current.childElementCount > 100) {
        ref.current.removeChild(ref.current.firstChild);
      }

      ref.current.scrollTop = Number.MAX_SAFE_INTEGER;
    }
  }, [ref]);

  useEffect(() => {
    ipcRendererListen(SCRIPT_LOG, logHandler);
    return () => ipcRendererClear(SCRIPT_LOG, logHandler);
  }, [logHandler]);

  return (
    <FullHeightCard>
      <StyledContainer>
        <StyledTopRow>
          <ButtonGroup>
            <Button
              small
              icon="eraser"
              title="Clear console"
              onClick={clearClickHandler}
            />
          </ButtonGroup>
        </StyledTopRow>
        <StyledBottomRow>
          <StyledConsoleContainer ref={ref} />
        </StyledBottomRow>
      </StyledContainer>
    </FullHeightCard>
  );
}
