import React from 'react';
import styled from 'styled-components';
import { ConfigProvider, theme } from 'antd';

import MainNav from './components/MainNav';
import Browsers from './components/Browsers';
import DialogsContainer from './components/DialogsContainer';
import ScriptsEditor from './components/ScriptsEditor';
import TimelinesBoardsEditor from './components/TimelinesBoardsEditor';
import ToastsContainer from './components/ToastsContainer';
import AntdCompatWrapper from './AntdCompatWrapper';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledTopRow = styled.div`
  padding-bottom: 5px;
`

const StyledBottomRow = styled.div`
  display: flex;
  flex-grow: 1;
`

const StyledLeftCol = styled.div`
  width: 300px;
  height: 100%;
  padding-right: 5px;
`

const StyledRightCol = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-grow: 1;
`

const StyledScriptsRow = styled.div`
  height: 50%;
  padding-bottom: 5px;
`

const StyledTimelinesDashboardsRow = styled.div`
  height: 50%;
`

export default function Main(props) {
  return (
    <AntdCompatWrapper>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <StyledContainer>
          <StyledTopRow>
            <MainNav />
          </StyledTopRow>
          <StyledBottomRow>
            <StyledLeftCol>
              <Browsers />
            </StyledLeftCol>
            <StyledRightCol>
              <StyledScriptsRow>
                <ScriptsEditor />
              </StyledScriptsRow>
              <StyledTimelinesDashboardsRow>
                <TimelinesBoardsEditor />
              </StyledTimelinesDashboardsRow>
            </StyledRightCol>
          </StyledBottomRow>
        </StyledContainer>
        <DialogsContainer />
        <ToastsContainer />
      </ConfigProvider>
    </AntdCompatWrapper>
  );
}
