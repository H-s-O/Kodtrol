import React, { PureComponent } from 'react';

import BaseModal from './BaseModal';
import mediaInfo from '../../lib/mediaInfo'

export default class MediaModal extends PureComponent {
  modalValueFilter = (data, callback) => {
    const { file } = data;
    if (!file) {
      callback(data);
      return;
    }
    mediaInfo(file, (err, info) => {
      if (err) {
        callback(data);
        return;
      }
      const { streams } = info;
      const [firstStream] = streams;
      const { duration_ts, codec_long_name } = firstStream;
      callback({
        ...data,
        duration: duration_ts,
        codec: codec_long_name,
      });
    });
  }

  render = () => {
    const { outputs, ...otherProps } = this.props;
    return (
      <BaseModal
        {...otherProps}
        dialogClassName="media-modal"
        valueFilter={this.modalValueFilter}
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
            label: 'Duration',
            field: 'duration',
            type: 'static',
          },
          {
            label: 'Codec',
            field: 'codec',
            type: 'static',
          },
          {
            label: 'Output to',
            field: 'output',
            type: 'select',
            from: 'outputs',
          },
        ]}
      />
    );
  }
};
