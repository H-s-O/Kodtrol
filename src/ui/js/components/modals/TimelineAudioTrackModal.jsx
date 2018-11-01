import React, { PureComponent } from 'react';
import BaseModal from './BaseModal';

export default function(props) {
  const { layers, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      relatedData={{
        layers: layers.map(({id, order}) => ({
          id,
          label: order + 1,
        })),
      }}
      fields={[
        {
          label: 'File',
          field: 'file',
          type: 'file',
        },
        {
          label: 'Layer',
          field: 'layer',
          type: 'select',
          from: 'layers',
        },
        {
          label: 'In time',
          field: 'inTime',
          type: 'number',
        },
        {
          label: 'Out time',
          field: 'outTime',
          type: 'number',
        },
        {
          label: 'Volume',
          field: 'volume',
          type: 'number',
        },
        {
          label: 'Color',
          field: 'color',
          type: 'color',
        },
      ]}
    />
  );
}
