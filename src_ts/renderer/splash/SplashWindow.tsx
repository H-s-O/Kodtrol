/// <reference path="splash-preload.d.ts" />

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Intent } from '@blueprintjs/core'

import FullHeightCard from '../../../src/ui/js/components/ui/FullHeightCard'
import { APP_NAME } from '../../common/constants'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const StyledButtonsContainer = styled.div`
  margin-top: 40px;

  & > *:not(:last-child) {
    margin-right: 20px;
  }
`

export default function SplashWindow() {
  const createClickHandler = useCallback(() => {
    window.kodtrol.mainRequestCreateProject()
  }, [])
  const loadClickHandler = useCallback(() => {
    window.kodtrol.mainRequestLoadProject()
  }, [])
  const quitClickHandler = useCallback(() => {
    window.kodtrol.mainRequestQuit()
  }, [])

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
  )
}
