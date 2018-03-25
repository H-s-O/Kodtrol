import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { template } from 'lodash';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux'

import Layout from './Layout';

import styles from '../styles/main.scss';

const Main = class Main extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onEditorSave(value) {
    console.log('onEditorSave', value);
    ipcRenderer.send('saveScript', value);
  }

  onScriptSelect(scriptName) {
    console.log('onScriptSelect', scriptName);
    ipcRenderer.send('scriptSelect', scriptName);
  }

  render() {
    const { scripts, currentScript } = this.props;
    // console.log('render', scripts);
    return (
      <Layout
        scripts={scripts}
        currentScript={currentScript}
        onEditorSave={this.onEditorSave}
        onScriptSelect={this.onScriptSelect}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { scripts, currentScript } = state;
  // console.log('mapStateToProps', state);
  return {
    scripts,
    currentScript,
  }
};

export default connect(mapStateToProps)(Main);
