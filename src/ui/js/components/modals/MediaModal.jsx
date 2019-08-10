import React, { PureComponent } from 'react';

import BaseModal from './BaseModal';
import mediaInfo from '../../lib/mediaInfo'

export default class MediaModal extends PureComponent {
  state = {
    mediaInfoData: null,
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.initialValue != this.props.initialValue) {
      this.setState({
        mediaInfoData: null,
      });
    }
  }

  onModalChange = (data) => {
    const { file } = data;
    if (file) {
      mediaInfo(file, (err, info) => {
        if (err) {
          return;
        }
        const { streams } = info;
        const [firstStream] = streams;
        const { duration_ts, codec_long_name } = firstStream;
        this.setState({
          mediaInfoData: {
            duration: duration_ts,
            codec: codec_long_name,
          },
        });
      });
    }
  }

  render = () => {
    const { outputs, initialValue, ...otherProps } = this.props;
    const { mediaInfoData } = this.state;
    return (
      <BaseModal
        {...otherProps}
        initialValue={mediaInfoData ? { ...initialValue, ...mediaInfoData } : initialValue}
        dialogClassName="media-modal"
        onChange={this.onModalChange}
        relatedData={{
          outputs: outputs.map(({ id, name }) => ({
            value: id,
            label: name,
          })),
        }}
        fields={[
          {
            label: 'Name',
            field: 'name',
            type: 'text',
          },
          {
            label: 'File',
            field: 'file',
            type: 'file',
          },
          {
            label: 'Output to',
            field: 'output',
            type: 'select',
            from: 'outputs',
          },
          {
            label: 'Duration',
            field: 'duration',
            type: 'static',
          },
          {
            label: 'Codec',
            field: 'codec',
            type: 'static',
          },
        ]}
      />
    );
  }
};
