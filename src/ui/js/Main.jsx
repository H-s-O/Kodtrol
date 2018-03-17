import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { template } from 'lodash';
import { ipcRenderer } from 'electron';

import Layout from './Layout';

import styles from '../styles/main.scss';

export default class Main extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    // this.state = {
    //   editorValue: null,
    // };

    console.log(ipcRenderer.sendSync);
  }

  onEditorChange(value, evt) {
    // console.log(value);
    // this.setState({
    //   editorValue: value,
    // });


  }

  onEditorSave(value) {
    console.log('onEditorSave', value);

    ipcRenderer.send('asynchronous-message', value);
    // const
  }

  render() {
    return (
      <Layout
        editorValue={this.props.editorValue}
        onEditorChange={this.onEditorChange}
        onEditorSave={this.onEditorSave}
      />
    );
  }
}
