import React, { PureComponent } from 'react';
import BaseModal from './BaseModal';

export default function ImportFromProjectModal(props) {
  const { items, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      successLabel="Import"
      initialValue={{ device: null }}
      relatedData={{
        items: (items || []).map((item) => ({
          value: item,
          label: item.name,
        })),
      }}
      fields={
        [
          {
            label: 'Device',
            field: 'device',
            type: 'select',
            from: 'items',
            hideEmpty: true,
          },
        ]}
    />
  );
}
