import React, { Component } from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import autoBind from 'react-autobind';
import { Button } from 'react-bootstrap';

import Panel from './Panel';

import styles from '../../../styles/components/partials/scripteditor.scss';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';

export default class ScriptEditor extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.editorValue = null;
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  onEditorChange(value, evt) {
    this.editorValue = value;
  }

  onSaveClick(evt) {
    const { onSave } = this.props;
    if (onSave) {
      console.log('onSave', this.editorValue);
      onSave(this.editorValue);
    }
  }

  render() {
    const { onChange, value, onSave } = this.props;

    // @TODO fix
    this.editorValue = value;

    return (
      <Panel
        title="Script editor"
        className={styles.fullHeight}
        headingContent={
          <Button
            bsSize="xsmall"
            onClick={this.onSaveClick}
          >
            Save
          </Button>
        }
      >
        <AceEditor
          value={value}
          onChange={this.onEditorChange}
          fontSize={12}
          tabSize={2}
          showPrintMargin={false}
          width="100%"
          height="92%"
          mode="javascript"
          theme="tomorrow_night_eighties"
          name="UNIQUE_ID_OF_DIV"
          editorProps={{
            $blockScrolling: Infinity
          }}
        />
      </Panel>
    );
  }
};
