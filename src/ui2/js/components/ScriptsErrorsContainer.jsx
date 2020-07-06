import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Toaster, Intent, Icon } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { ipcRendererListen, ipcRendererClear } from '../lib/ipcRenderer';
import { SCRIPT_ERROR } from '../../../common/js/constants/events';
import { ICON_TIMELINE, ICON_BOARD, ICON_SCRIPT } from '../../../common/js/constants/icons';

const StyledParagraph = styled.p`
  margin: 0;
`

const StyledHr = styled.hr`
  border: 0;
  border-top: 1px solid #FFF;
`

export default function ScriptsErrorsContainer() {
  const scripts = useSelector((state) => state.scripts);
  const timelines = useSelector((state) => state.timelines);
  const boards = useSelector((state) => state.boards);

  const scriptsNames = useMemo(() => {
    return scripts.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [scripts]);
  const timelinesNames = useMemo(() => {
    return timelines.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [timelines]);
  const boardsNames = useMemo(() => {
    return boards.reduce((obj, { id, name }) => ({ ...obj, [id]: name }), {});
  }, [boards]);

  const ref = useRef();

  const scriptErrorHandler = useCallback((e, { script, message, hook, timeline, board }) => {
    if (ref.current) {
      const breadcrumb = (
        <>
          Error in
          {timeline ? <> <Icon icon={ICON_TIMELINE} /> {timelinesNames[timeline]}<Icon icon="chevron-right" /></> : null}
          {board ? <> <Icon icon={ICON_BOARD} /> {boardsNames[board]}<Icon icon="chevron-right" /></> : null}
          <> <Icon icon={ICON_SCRIPT} /> {scriptsNames[script]}</>
          {hook ? <><Icon icon="chevron-right" />{hook}() hook</> : null}
        </>
      );

      ref.current.show({
        icon: 'error',
        intent: Intent.DANGER,
        message: (
          <>
            <StyledParagraph><strong>{breadcrumb}</strong></StyledParagraph>
            <StyledHr />
            <StyledParagraph><em>{message}</em></StyledParagraph>
          </>
        )
      });
    }
  }, [ref, scripts, timelines, boards]);

  useEffect(() => {
    ipcRendererListen(SCRIPT_ERROR, scriptErrorHandler);
    return () => ipcRendererClear(SCRIPT_ERROR, scriptErrorHandler);
  }, []);

  return (
    <Toaster
      ref={ref}
    />
  )
}
