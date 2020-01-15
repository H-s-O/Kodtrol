import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';

export default function CodeEditor(props) {
  return (
    <AceEditor
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
      // temp
      setOptions={{
        useWorker: false
      }}
      {...props}
    />
  )
}
