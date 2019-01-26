import React, { PureComponent } from 'react';
import BaseModal from '../../modals/BaseModal';

export default function(props) {
  const { scripts, layers, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      relatedData={{
        scripts: scripts.map(({id, name}) => ({
          id,
          label: name,
        })),
        layers: layers.map(({id, order}) => ({
          id,
          label: order + 1,
        })),
        types: [
          { id: 'trigger_once', label: 'Trigger once' },
          { id: 'trigger_mult', label: 'Trigger multiple' },
          { id: 'toggle', label: 'Toggle' },
        ],
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
          label: 'Type',
          field: 'type',
          type: 'select',
          from: 'types',
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
