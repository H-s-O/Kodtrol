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
          label: 'Color',
          field: 'color',
          type: 'color',
        },
      ]}
    />
  );
}
