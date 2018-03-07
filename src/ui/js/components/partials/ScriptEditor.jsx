import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';

import Panel from './Panel';

import styles from '../../../styles/components/partials/scripteditor.scss';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';

export default props => (
  <Panel
    title="Script editor"
    className={styles.fullHeight}
  >
    <AceEditor
      fontSize={13}
      showPrintMargin={false}
      width="100%"
      height="100%"
      mode="javascript"
      theme="tomorrow_night_eighties"
      name="UNIQUE_ID_OF_DIV"
      editorProps={{$blockScrolling: true}}
    />
  </Panel>
);
