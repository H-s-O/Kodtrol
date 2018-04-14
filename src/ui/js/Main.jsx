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

  onEditorSave(scriptData) {
    console.log('onEditorSave', scriptData);
    ipcRenderer.send('saveScript', scriptData);
  }

  onScriptSelect(scriptName) {
    console.log('onScriptSelect', scriptName);
    ipcRenderer.send('scriptSelect', scriptName);
  }

  onScriptCreate(scriptData) {
    console.log('onScriptCreate', scriptData);
    ipcRenderer.send('scriptCreate', scriptData);
  }

  onDeviceCreate(deviceData) {
    console.log('onDeviceCreate', deviceData);
    ipcRenderer.send('deviceCreate', deviceData);
  }

  render() {
    const { scripts, currentScript, devices } = this.props;
    // console.log('render', scripts);
    return (
      <Layout
        scripts={scripts}
        devices={devices}
        currentScript={currentScript}
        onEditorSave={this.onEditorSave}
        onScriptSelect={this.onScriptSelect}
        onScriptCreate={this.onScriptCreate}
        onDeviceCreate={this.onDeviceCreate}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { scripts, currentScript, devices } = state;
  // console.log('mapStateToProps', state);
  return {
    scripts,
    currentScript,
    devices,
  }
};

export default connect(mapStateToProps)(Main);
