import React, { MouseEventHandler, useCallback, useMemo } from 'react';
import { Tab, Icon, Button, Intent, NonIdealState, Colors, IconName } from '@blueprintjs/core';
import styled from 'styled-components';
import useHotkeys from '@reecelucas/react-use-hotkeys';
import { ok } from 'assert';

import FullHeightCard from '../../common/components/FullHeightCard';
import FullHeightTabs from './ui/FullHeightTabs';
import TimelineEditorTab from './timelines/TimelineEditorTab';
import BoardEditorTab from './boards/BoardEditorTab';
import {
  closeTimelineAction,
  focusEditedTimelineAction,
  saveEditedTimelineAction,
  runTimelineAction,
} from '../store/actions/timelines';
import {
  closeBoardAction,
  focusEditedBoardAction,
  saveEditedBoardAction,
  runBoardAction,
} from '../store/actions/boards';
// import { closeWarning } from '../lib/messageBoxes';
import { useKodtrolDispatch, useKodtrolSelector } from '../lib/hooks';
import { BoardId, ItemNamesObject, TimelineId } from '../../../common/types';
import { KodtrolIconType } from '../constants';

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
`;


type TabLabelProps = {
  id: TimelineId | BoardId
  name: string
  icon: IconName
  changed: boolean
  onClose: (id: TimelineId | BoardId) => any
};

const TabLabel = ({ id, name, icon, changed, onClose }: TabLabelProps) => {
  const closeHandler: MouseEventHandler = useCallback((e) => {
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
  const editTimelines = useKodtrolSelector((state) => state.editTimelines);
  const editBoards = useKodtrolSelector((state) => state.editBoards);
  const timelines = useKodtrolSelector((state) => state.timelines);
  const boards = useKodtrolSelector((state) => state.boards);
  const lastEditor = useKodtrolSelector((state) => state.lastEditor);

  const timelinesNames = useMemo(() => {
    return timelines.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<TimelineId>);
  }, [timelines]);
  const boardsNames = useMemo(() => {
    return boards.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<BoardId>);
  }, [boards]);
  const activeTimeline = useMemo(() => {
    return editTimelines.find(({ active }) => active);
  }, [editTimelines]);
  const activeBoard = useMemo(() => {
    return editBoards.find(({ active }) => active);
  }, [editBoards]);

  const dispatch = useKodtrolDispatch();
  const closeTimelineHandler = useCallback((id: TimelineId) => {
    const editTimeline = editTimelines.find((timeline) => timeline.id === id);
    ok(editTimeline, 'editTimeline not found');
    if (editTimeline.changed) {
      // closeWarning(`Are you sure you want to close "${timelinesNames[id]}"?`, 'Unsaved changes will be lost.', (result) => {
      //   if (result) {
      //     dispatch(closeTimelineAction(id));
      //   }
      // })
    } else {
      dispatch(closeTimelineAction(id));
    }
  }, [dispatch, timelinesNames, editTimelines]);
  const closeBoardHandler = useCallback((id: BoardId) => {
    const editBoard = editBoards.find((board) => board.id === id);
    ok(editBoard, 'editBoard not found');
    if (editBoard.changed) {
      // closeWarning(`Are you sure you want to close "${boardsNames[id]}"?`, 'Unsaved changes will be lost.', (result) => {
      //   if (result) {
      //     dispatch(closeBoardAction(id));
      //   }
      // })
    } else {
      dispatch(closeBoardAction(id));
    }
  }, [dispatch, boardsNames, editBoards]);
  const tabChangeHandler = useCallback((id: TimelineId | BoardId) => {
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

  useHotkeys(`${window.kodtrol_editor.IS_MAC ? 'Meta' : 'Control'}+s`, saveHandler);
  useHotkeys(`${window.kodtrol_editor.IS_MAC ? 'Meta' : 'Control'}+r`, saveAndRunHandler);

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
                icon={KodtrolIconType.TIMELINE}
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
                icon={KodtrolIconType.BOARD}
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
            icon={KodtrolIconType.TIMELINE}
            title="Timeline Editor"
            description={<>Double-click a timeline in the<br />timeline browser to edit it here.</>}
          />
          <NonIdealState
            icon={KodtrolIconType.BOARD}
            title="Board Editor"
            description={<>Double-click a board in the<br />board browser to edit it here.</>}
          />
        </StyledRow>
      )}
    </FullHeightCard>
  )
}
