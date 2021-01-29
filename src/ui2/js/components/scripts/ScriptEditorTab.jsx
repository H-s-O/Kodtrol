import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CodeEditor from '../ui/CodeEditor';
import { updateEditedScriptAction } from '../../../../common/js/store/actions/scripts';

export default function ScriptEditor({ id }) {
  const editScripts = useSelector((state) => state.editScripts);
  const { content } = editScripts.find((script) => script.id === id);

  const dispatch = useDispatch();
  const changeHandler = useCallback((content) => {
    dispatch(updateEditedScriptAction(id, { content }));
  }, [dispatch, id]);

  return (
    <CodeEditor
      value={content}
      name={`script-editor-${id}`}
      onChange={changeHandler}
    />
  )
}
