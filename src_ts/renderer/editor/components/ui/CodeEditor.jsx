import React, { useCallback } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';

export default function CodeEditor(props) {
  const editorRef = useCallback((ref) => {
    if (ref && ref.editor) {
      // Disable missing semicolon warning
      // @see https://github.com/ajaxorg/ace/issues/1754#issuecomment-43173900
      ref.editor.session.$worker.send("changeOptions", [{ asi: true }]);
    }
  }, []);

  return (
    <AceEditor
      ref={editorRef}
      fontSize={12}
      tabSize={2}
      debounceChangePeriod={250}
      showPrintMargin={false}
      width="100%"
      height="100%"
      mode="javascript"
      theme="tomorrow_night_eighties"
      editorProps={{
        $blockScrolling: Infinity
      }}
      {...props}
    />
  )
}
