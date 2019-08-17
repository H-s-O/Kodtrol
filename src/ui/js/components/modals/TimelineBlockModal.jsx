import React, { PureComponent } from 'react';
import BaseModal from './BaseModal';

export default function TimelineBlockModal(props) {
  const { scripts, layers, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      relatedData={{
        scripts: scripts.map(({id, name}) => ({
          value: id,
          label: name,
        })),
        layers: layers.map(({id, order}) => ({
          value: id,
          label: order + 1,
        })),
      }}
      fields={[
        {
          label: 'Script',
          field: 'script',
          type: 'select',
          from: 'scripts',
        },
        {
          label: 'Layer',
          field: 'layer',
          type: 'select',
          from: 'layers',
        },
        {
          label: 'Name',
          field: 'name',
          type: 'text',
          placeholder: '(optional)'
        },
        {
          label: 'In time',
          field: 'inTime',
          type: 'number',
        },
        {
          label: 'Lead-in time',
          field: 'leadInTime',
          type: 'number',
          placeholder: '(optional, default: 500)'
        },
        {
          label: 'Out time',
          field: 'outTime',
          type: 'number',
        },
        {
          label: 'Lead-out time',
          field: 'leadOutTime',
          type: 'number',
          placeholder: '(optional, default: 500)'
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
