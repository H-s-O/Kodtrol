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
    ipcRenderer.send('asynchronous-message', value);
  }

  render() {
    const { scripts } = this.props;
    // console.log('render', scripts);
    return (
      <Layout
        scripts={scripts}
        onEditorSave={this.onEditorSave}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { scripts } = state;
  // console.log('mapStateToProps', state);
  return {
    scripts,
  }
};

export default connect(mapStateToProps)(Main);
