import React, { useCallback } from 'react';

import CodeEditor from '../ui/CodeEditor';
import { updateEditedScriptAction } from '../../store/actions/scripts';
import { useKodtrolDispatch, useKodtrolSelector } from '../../lib/hooks';
import { ScriptId } from '../../../../common/types';
import { ok } from 'assert';

type ScriptEditorProps = {
  id: ScriptId
};

export default function ScriptEditor({ id }: ScriptEditorProps) {
  const editScripts = useKodtrolSelector((state) => state.editScripts);
  const editScript = editScripts.find((script) => script.id === id);
  ok(editScript, 'editScript not found');
  const { content } = editScript;

  const dispatch = useKodtrolDispatch();
  const changeHandler = useCallback((content: string) => {
    dispatch(updateEditedScriptAction(id, { content }));
  }, [dispatch, id]);

  return (
    <CodeEditor
      value={content}
      name={`script-editor-${id}`}
      onChange={changeHandler}
    />
  )
};
