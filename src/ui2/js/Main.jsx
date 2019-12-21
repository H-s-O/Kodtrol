import React from 'react';
import styled from 'styled-components';

import MainNav from './components/MainNav';
import Browsers from './components/Browsers';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledTopRow = styled.div`
  background-color: red;
`

const StyledBottomRow = styled.div`
  flex: 1;
  margin-top: 5px;
`

const StyledLeftCol = styled.div`
  width: 300px;
  margin-right: 5px;
  background-color: black;
`

const StyledRightCol = styled.div`
  flex: 1;
  background-color: blue;
`

export default function Main(props) {
  return (
    <StyledContainer>
      <StyledTopRow>
        <MainNav />
      </StyledTopRow>
      <StyledBottomRow>
        <StyledLeftCol>
          <Browsers />
        </StyledLeftCol>
        <StyledRightCol>

        </StyledRightCol>
      </StyledBottomRow>
    </StyledContainer>
  );
}
