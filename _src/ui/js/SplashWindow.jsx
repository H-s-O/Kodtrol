import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button, Intent } from '@blueprintjs/core';

import { APP_NAME } from '../../common/js/constants/app';
import FullHeightCard from './components/ui/FullHeightCard';
import { ipcRendererSend } from './lib/ipcRenderer';
import { TRIGGER_CREATE_PROJECT, TRIGGER_QUIT, TRIGGER_LOAD_PROJECT } from '../../common/js/constants/events';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StyledButtonsContainer = styled.div`
  margin-top: 40px;

  & > *:not(:last-child) {
    margin-right: 20px;
  }
`;

export default function SplashWindow() {
  const createClickHandler = useCallback(() => {
    ipcRendererSend(TRIGGER_CREATE_PROJECT);
  }, []);
  const loadClickHandler = useCallback(() => {
    ipcRendererSend(TRIGGER_LOAD_PROJECT);
  }, []);
  const quitClickHandler = useCallback(() => {
    ipcRendererSend(TRIGGER_QUIT);
  }, []);


  return (
    <FullHeightCard>
      <StyledContainer>
        <h1>{APP_NAME} [beta 1]</h1>
        <h3>Scripted show control</h3>
        <StyledButtonsContainer>
          <Button
            large
            intent={Intent.PRIMARY}
            onClick={createClickHandler}
          >
            Create project...
           </Button>
          <Button
            large
            intent={Intent.PRIMARY}
            onClick={loadClickHandler}
          >
            Open project...
           </Button>
          <Button
            large
            onClick={quitClickHandler}
          >
            Quit
           </Button>
        </StyledButtonsContainer>
      </StyledContainer>
    </FullHeightCard>
  );
}
