import React from 'react';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

export default function CodeEditor(props) {
  return (
    <AceEditor
      {...props}
      fontSize={12}
      tabSize={2}
      showPrintMargin={false}
      width="100%"
      height="100%"
      mode="javascript"
      theme="tomorrow_night_eighties"
      name="script_aceeditor"
      editorProps={{
        $blockScrolling: Infinity
      }}
      // temp
      setOptions={{
        useWorker: false
      }}
    />
  )
}
