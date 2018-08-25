import React from 'react';
import BaseModal from './BaseModal';
import DevicesTableField from './fields/DevicesTableField';

export default function(props) {
  const { devices, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      relatedData={{
        devices,
      }}
      fields={[
        {
          label: 'Name',
          field: 'name',
          type: 'text',
        },
        {
          label: 'Preview tempo',
          field: 'previewTempo',
          type: 'number',
        },
        {
          label: 'Associated devices',
          field: 'devices',
          type: DevicesTableField,
          from: 'devices',
        },
      ]}
    />
  );
};
