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
          label: 'Trigger',
          field: 'trigger',
          type: 'text',
        },
        {
          label: 'Layer',
          field: 'layer',
          type: 'select',
          from: 'layers',
        },
        {
          label: 'Time',
          field: 'inTime',
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
