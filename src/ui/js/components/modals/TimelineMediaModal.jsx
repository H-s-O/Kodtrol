import React, { PureComponent } from 'react';
import BaseModal from './BaseModal';

export default function TimelineMediaModal(props) {
  const { layers, medias, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      relatedData={{
        layers: layers.map(({id, order}) => ({
          value: id,
          label: order + 1,
        })),
        medias: medias.map(({id, name}) => ({
          value: id,
          label: name,
        })),
      }}
      fields={[
        {
          label: 'Media',
          field: 'media',
          type: 'select',
          from: 'medias',
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
          placeholder: '(optional)',
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
