import React, { useCallback, useMemo } from 'react';
import { Tab, Icon, Button, Intent, NonIdealState, Colors } from '@blueprintjs/core';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import FullHeightCard from './ui/FullHeightCard';
import FullHeightTabs from './ui/FullHeightTabs';
import { ICON_TIMELINE, ICON_BOARD } from '../../../common/js/constants/icons';
import TimelineEditorTab from './timelines/TimelineEditorTab';
import { closeTimelineAction, focusEditedTimelineAction } from '../../../common/js/store/actions/timelines';
import BoardEditorTab from './boards/BoardEditorTab';
import { closeBoardAction, focusEditedBoardAction } from '../../../common/js/store/actions/boards';

const StyledDivider = styled.div`
  width: 1px;
  height: 75%;
  top: 0px;
  background: ${Colors.GRAY1};
`;

const StyledIcon = styled(Icon)`
  margin-right: 3px;
`;

const StyledCloseButton = styled(Button)`
  margin-left: 3px;
`;

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const TabLabel = ({ id, name, icon, changed, onClose }) => {
  const closeHandler = useCallback((e) => {
    e.stopPropagation();
    onClose(id)
  }, [id, onClose]);

  return (
    <>
      <StyledIcon
        icon={icon}
        intent={changed ? Intent.WARNING : undefined}
      />
      {name}
      <StyledCloseButton
        small
        minimal
        icon="small-cross"
        onClick={closeHandler}
      />
    </>
  );
}

export default function TimelinesBoardsEditor() {
  const editTimelines = useSelector((state) => state.editTimelines);
  const editBoards = useSelector((state) => state.editBoards);
  const timelines = useSelector((state) => state.timelines);
  const boards = useSelector((state) => state.boards);

  const timelinesNames = useMemo(() => {
    return timelines.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [timelines]);
  const boardsNames = useMemo(() => {
    return boards.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [boards]);
  const activeTimeline = useMemo(() => {
    return editTimelines.find(({ active }) => active);
  }, [editTimelines]);
  const activeBoard = useMemo(() => {
    return editBoards.find(({ active }) => active);
  }, [editBoards]);

  const dispatch = useDispatch();
  const closeTimelineHandler = useCallback((id) => {
    dispatch(closeTimelineAction(id));
  }, [dispatch]);
  const closeBoardHandler = useCallback((id) => {
    dispatch(closeBoardAction(id));
  }, [dispatch]);
  const tabChangeHandler = useCallback((id) => {
    if (editTimelines.find((timeline) => timeline.id === id)) {
      dispatch(focusEditedTimelineAction(id));
    } else if (editBoards.find((board) => board.id === id)) {
      dispatch(focusEditedBoardAction(id));
    }
  }, [dispatch, editTimelines, editBoards]);

  return (
    <FullHeightCard>
      {((editTimelines && editTimelines.length > 0) || (editBoards && editBoards.length > 0)) ? (
        <FullHeightTabs
          id="timelines_boards_editor"
          selectedTabId={activeTimeline ? activeTimeline.id : activeBoard ? activeBoard.id : undefined}
          onChange={tabChangeHandler}
        >
          {(editTimelines && editTimelines.length > 0) && editTimelines.map(({ id, changed }) => (
            <Tab
              key={id}
              id={id}
              panel={(
                <TimelineEditorTab
                  id={id}
                />
              )}
            >
              <TabLabel
                icon={ICON_TIMELINE}
                id={id}
                changed={changed}
                name={timelinesNames[id]}
                onClose={closeTimelineHandler}
              />
            </Tab>
          ))}
          {(editTimelines && editTimelines.length > 0 && editBoards && editBoards.length > 0) && (
            <StyledDivider />
          )}
          {(editBoards && editBoards.length > 0) && editBoards.map(({ id, changed }) => (
            <Tab
              key={id}
              id={id}
              panel={(
                <BoardEditorTab
                  id={id}
                />
              )}
            >
              <TabLabel
                icon={ICON_BOARD}
                id={id}
                changed={changed}
                name={boardsNames[id]}
                onClose={closeBoardHandler}
              />
            </Tab>
          ))}
        </FullHeightTabs>
      ) : (
          <StyledRow>
            <NonIdealState
              icon={ICON_TIMELINE}
              title="Timeline Editor"
              description="Double-click a timeline in the timeline browser to edit it here."
            />
            <NonIdealState
              icon={ICON_BOARD}
              title="Board Editor"
              description="Double-click a board in the board browser to edit it here."
            />
          </StyledRow>
        )}
    </FullHeightCard>
  )
}
