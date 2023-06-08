import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Toaster, Intent, Icon } from '@blueprintjs/core';
import styled from 'styled-components';

// import { SCRIPT_ERROR } from '../../../common/js/constants/events';
import { useKodtrolSelector } from '../lib/hooks';
import { BoardId, ItemNamesObject, ScriptId, TimelineId } from '../../../common/types';
import { KodtrolIconType } from '../constants';

const StyledTitle = styled.p`
  margin: 0;
  font-weight: bold;
`

const StyledHr = styled.hr`
  border: 0;
  border-top: 1px solid #FFF;
`

const StyledMessage = styled.pre``;

export default function ScriptsErrorsContainer() {
  const scripts = useKodtrolSelector((state) => state.scripts);
  const timelines = useKodtrolSelector((state) => state.timelines);
  const boards = useKodtrolSelector((state) => state.boards);

  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<ScriptId>);
  }, [scripts]);
  const timelinesNames = useMemo(() => {
    return timelines.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<TimelineId>);
  }, [timelines]);
  const boardsNames = useMemo(() => {
    return boards.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {} as ItemNamesObject<BoardId>);
  }, [boards]);

  const ref = useRef<Toaster>();

  const scriptErrorHandler = useCallback((e, { script, message, hook, timeline, board }) => {
    if (ref.current) {
      const breadcrumb = (
        <>
          Error in
          {timeline ? <> <Icon icon={KodtrolIconType.TIMELINE} /> {timelinesNames[timeline]}<Icon icon="chevron-right" /></> : null}
          {board ? <> <Icon icon={KodtrolIconType.BOARD} /> {boardsNames[board]}<Icon icon="chevron-right" /></> : null}
          <> <Icon icon={KodtrolIconType.SCRIPT} /> {scriptsNames[script]}</>
          {hook ? <><Icon icon="chevron-right" />{hook}() hook</> : null}
        </>
      );

      ref.current.show({
        icon: 'error',
        intent: Intent.DANGER,
        message: (
          <>
            <StyledTitle>{breadcrumb}</StyledTitle>
            <StyledHr />
            <StyledMessage>{message}</StyledMessage>
          </>
        )
      });
    }
  }, [ref, scripts, timelines, boards]);

  useEffect(() => {
    // ipcRendererListen(SCRIPT_ERROR, scriptErrorHandler);
    // return () => ipcRendererClear(SCRIPT_ERROR, scriptErrorHandler);
  }, []);

  return (
    <Toaster
      ref={ref}
      maxToasts={5}
    />
  )
}
