import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import brace from 'brace';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

import Panel from './Panel';
import { saveScript, previewScript } from '../../../../common/js/store/actions/scripts';
import styles from '../../../styles/components/partials/scripteditor.scss';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';

const propTypes = {
  currentScript: PropTypes.string,
  value: PropTypes.string,
  doSaveScript: PropTypes.func.isRequired,
}

const defaultProps = {
  currentScript: null,
  value: null,
};

class ScriptEditor extends PureComponent {
  state = {
    editorValue: null,
  };

  onEditorChange = (value, evt) => {
    this.setState({
      editorValue: value,
    });
  }

  onSaveClick = () => {
    this.saveScript();
  }
  
  onSaveAndPreviewClick = () => {
    this.saveScript();
    
    const { doPreviewScript, currentScript } = this.props;
    doPreviewScript(currentScript);
  }
  
  saveScript = () => {
    const { editorValue } = this.state;
    const { doSaveScript, currentScript } = this.props;
    doSaveScript(currentScript, editorValue);
    
    this.setState({
      editorValue: null,
    });
  }

  render = () => {
    const { currentScript, value } = this.props;
    const { editorValue } = this.state;
    
    return (
      <Panel
        title="Script editor"
        className={styles.fullHeight}
        headingContent={ currentScript ? (
          <ButtonToolbar>
            <Button
              bsSize="xsmall"
              onClick={this.onSaveClick}
              disabled={!editorValue}
            >
              Save
            </Button>
            <Button
              bsSize="xsmall"
              onClick={this.onSaveAndPreviewClick}
              disabled={!editorValue}
            >
              Save and preview
            </Button>
          </ButtonToolbar>
        ) : null }
      >
        { value ? (
          <AceEditor
            value={editorValue || value}
            onChange={this.onEditorChange}
            fontSize={12}
            tabSize={2}
            showPrintMargin={false}
            width="100%"
            height="94%"
            mode="javascript"
            theme="tomorrow_night_eighties"
            name="script_aceeditor"
            editorProps={{
              $blockScrolling: Infinity
            }}
          />
        ) : null }
      </Panel>
    );
  }
};

ScriptEditor.propTypes = propTypes;
ScriptEditor.defaultProps = defaultProps;

const scriptValueSelector = createSelector(
  [
    (state) => state.currentScript,
    (state) => state.scripts,
  ],
  (currentScript, scripts) => {
    if (currentScript === null) {
      return null;
    }
    return scripts.find(({id}) => id === currentScript).content;
  }
);

const mapStateToProps = (state) => {
  return {
    currentScript: state.currentScript,
    value: scriptValueSelector(state),
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    doSaveScript: (id, content) => dispatch(saveScript(id, content)),
    doPreviewScript: (id) => dispatch(previewScript(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptEditor);
