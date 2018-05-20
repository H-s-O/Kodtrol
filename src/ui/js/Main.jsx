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

  onTimelineSelect(timelineId) {
    console.log('onTimelineSelect', timelineId);
    ipcRenderer.send('timelineSelect', timelineId);
  }

  onTimelineCreate(timelineData) {
    console.log('onTimelineCreate', timelineData);
    ipcRenderer.send('timelineCreate', timelineData);
  }

  onTimelineSave(timelineData) {
    console.log('onTimelineSave', timelineData);
    ipcRenderer.send('saveTimeline', timelineData);
  }

  onTimelineStatusUpdate(timelineStatus) {
    console.log('onTimelineStatusUpdate', timelineStatus);
    ipcRenderer.send('timelineStatus', timelineStatus);
  }

  render() {
    const { scripts, currentScript, devices, timelines, currentTimeline, timelineInfo } = this.props;
    return (
      <Layout
        scripts={scripts}
        devices={devices}
        timelines={timelines}
        timelineInfo={timelineInfo}
        currentScript={currentScript}
        currentTimeline={currentTimeline}
        onEditorSave={this.onEditorSave}
        onScriptSelect={this.onScriptSelect}
        onScriptCreate={this.onScriptCreate}
        onDeviceCreate={this.onDeviceCreate}
        onTimelineSelect={this.onTimelineSelect}
        onTimelineCreate={this.onTimelineCreate}
        onTimelineSave={this.onTimelineSave}
        onTimelineStatusUpdate={this.onTimelineStatusUpdate}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { scripts, currentScript, devices, timelines, currentTimeline, timelineInfo } = state;
  // console.log('mapStateToProps', state);
  return {
    scripts,
    currentScript,
    devices,
    timelines,
    currentTimeline,
    timelineInfo,
  }
};

export default connect(mapStateToProps)(Main);
