import React, { Component } from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import autoBind from 'react-autobind';
import { isFunction, get } from 'lodash';
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
    const { onSave, value } = this.props;
    if (isFunction(onSave)) {
      const { id } = value;
      onSave({
        id,
        content: this.editorValue
      });
    }
  }

  render() {
    const { value, onSave } = this.props;
    const content = get(value, 'content', undefined);

    // @TODO fix
    this.editorValue = content;

    return (
      <Panel
        title="Script editor"
        className={styles.fullHeight}
        headingContent={ value && (
          <Button
            bsSize="xsmall"
            onClick={this.onSaveClick}
          >
            Save
          </Button>
        )}
      >
        <AceEditor
          value={content}
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
