import React, { useCallback, useMemo } from 'react';
import { Tab, Icon, Button, Intent, NonIdealState, Colors } from '@blueprintjs/core';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import useHotkeys from '@reecelucas/react-use-hotkeys';

import FullHeightCard from './ui/FullHeightCard';
import FullHeightTabs from './ui/FullHeightTabs';
import { ICON_TIMELINE, ICON_BOARD } from '../../../common/js/constants/icons';
import TimelineEditorTab from './timelines/TimelineEditorTab';
import BoardEditorTab from './boards/BoardEditorTab';
import { closeTimelineAction, focusEditedTimelineAction, saveEditedTimelineAction, runTimelineAction } from '../../../common/js/store/actions/timelines';
import { closeBoardAction, focusEditedBoardAction, saveEditedBoardAction, runBoardAction } from '../../../common/js/store/actions/boards';
import { closeWarning } from '../lib/messageBoxes';
import { isMac } from '../../../common/js/lib/platforms';

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
  const lastEditor = useSelector((state) => state.lastEditor);
  const runTimeline = useSelector((state) => state.runTimeline);
  const timelineInfo = useSelector((state) => state.timelineInfo);

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
    const editTimeline = editTimelines.find((timeline) => timeline.id === id);
    if (editTimeline.changed) {
      closeWarning(`Are you sure you want to close "${timelinesNames[id]}"?`, 'Unsaved changes will be lost.', (result) => {
        if (result) {
          dispatch(closeTimelineAction(id));
        }
      })
    } else {
      dispatch(closeTimelineAction(id));
    }
  }, [dispatch, timelinesNames, editTimelines]);
  const closeBoardHandler = useCallback((id) => {
    const editBoard = editBoards.find((board) => board.id === id);
    if (editBoard.changed) {
      closeWarning(`Are you sure you want to close "${boardsNames[id]}"?`, 'Unsaved changes will be lost.', (result) => {
        if (result) {
          dispatch(closeBoardAction(id));
        }
      })
    } else {
      dispatch(closeBoardAction(id));
    }
  }, [dispatch, boardsNames, editBoards]);
  const tabChangeHandler = useCallback((id) => {
    if (editTimelines.find((timeline) => timeline.id === id)) {
      dispatch(focusEditedTimelineAction(id));
    } else if (editBoards.find((board) => board.id === id)) {
      dispatch(focusEditedBoardAction(id));
    }
  }, [dispatch, editTimelines, editBoards]);
  const saveHandler = useCallback(() => {
    if (lastEditor && lastEditor.type === 'timeline' && activeTimeline && activeTimeline.changed) {
      dispatch(saveEditedTimelineAction(activeTimeline.id));
    } else if (lastEditor && lastEditor.type === 'board' && activeBoard && activeBoard.changed) {
      dispatch(saveEditedBoardAction(activeBoard.id));
    }
  }, [dispatch, activeTimeline, activeBoard, lastEditor]);
  const saveAndRunHandler = useCallback(() => {
    if (lastEditor && lastEditor.type === 'timeline' && activeTimeline) {
      dispatch(saveEditedTimelineAction(activeTimeline.id));
      dispatch(runTimelineAction(activeTimeline.id));
    } else if (lastEditor && lastEditor.type === 'board' && activeBoard) {
      dispatch(saveEditedBoardAction(activeBoard.id));
      dispatch(runBoardAction(activeBoard.id));
    }
  }, [dispatch, activeTimeline, activeBoard, lastEditor]);

  useHotkeys(`${isMac ? 'Meta' : 'Control'}+s`, saveHandler);
  useHotkeys(`${isMac ? 'Meta' : 'Control'}+r`, saveAndRunHandler);

  return (
    <FullHeightCard
      className="timelines-boards-tabs"
    >
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
