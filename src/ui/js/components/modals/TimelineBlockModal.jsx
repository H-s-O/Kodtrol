import React, { PureComponent } from 'react';
import BaseModal from './BaseModal';

export default function(props) {
  const { scripts, layers, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      relatedData={{
        scripts,
        layers: layers.map((layer, index) => ({
          id: index,
          label: index + 1,
        })),
      }}
      fields={[
        {
          label: 'Name',
          field: 'name',
          type: 'text',
        },
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
          label: 'Color',
          field: 'color',
          type: 'color',
        },
      ]}
    />
  );
}