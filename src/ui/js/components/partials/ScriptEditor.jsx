import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import brace from 'brace';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from 'react-bootstrap';

import Panel from './Panel';
import { saveScript, previewScript } from '../../../../common/js/store/actions/scripts';
import styles from '../../../styles/components/partials/scripteditor.scss';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';

const propTypes = {
  value: PropTypes.shape({}),
  doSaveScript: PropTypes.func.isRequired,
}

const defaultProps = {
  value: null,
};

class ScriptEditor extends PureComponent {
  editorValue = null;
  
  onEditorChange = (value, evt) => {
    this.editorValue = value;
  }

  onSaveClick = () => {
    this.saveScript();
  }
  
  onSaveAndPreviewClick = () => {
    this.saveScript();
    
    const { doPreviewScript, value } = this.props;
    const { id } = value;
    doPreviewScript(id);
  }
  
  saveScript = () => {
    const { doSaveScript, value } = this.props;
    const data = {
      ...value,
      content: this.editorValue,
    };
    doSaveScript(data);
  }

  render = () => {
    const { value, onSave } = this.props;
    const content = get(value, 'content', undefined);

    // @TODO fix
    this.editorValue = content;

    return (
      <Panel
        title="Script editor"
        className={styles.fullHeight}
        headingContent={ value && (
          <ButtonGroup>
            <Button
              bsSize="xsmall"
              onClick={this.onSaveClick}
            >
              Save
            </Button>
            <Button
              bsSize="xsmall"
              onClick={this.onSaveAndPreviewClick}
            >
              Save and preview
            </Button>
          </ButtonGroup>
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

ScriptEditor.propTypes = propTypes;
ScriptEditor.defaultProps = defaultProps;

const mapStateToProps = ({currentScript}) => {
  return {
    value: currentScript,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doSaveScript: (data) => dispatch(saveScript(data)),
    doPreviewScript: (id) => dispatch(previewScript(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptEditor);
