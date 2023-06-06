/// <reference path="splash-preload.d.ts" />

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button, Intent } from '@blueprintjs/core';

import FullHeightCard from '../common/components/FullHeightCard';
import { APP_NAME } from '../../common/constants';

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

const SplashWindow = () => {
  const createClickHandler = useCallback(() => {
    window.kodtrol_splash.mainRequestCreateProject();
  }, []);
  const loadClickHandler = useCallback(() => {
    window.kodtrol_splash.mainRequestLoadProject();
  }, []);
  const quitClickHandler = useCallback(() => {
    window.kodtrol_splash.mainRequestQuit();
  }, []);

  return (
    <FullHeightCard>
      <StyledContainer>
        <h1>{APP_NAME} [beta 1 - {window.kodtrol_splash.APP_VERSION}]</h1>
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
        </StyledButtonsContainer>
        <StyledButtonsContainer>
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
};

export default SplashWindow;
