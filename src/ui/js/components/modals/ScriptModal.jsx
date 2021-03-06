import React from 'react';
import BaseModal from './BaseModal';
import DevicesTableField from './fields/DevicesTableField';

export default function ScriptModal(props) {
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
          placeholder: '1 - 300',
          min: 1,
          max: 300,
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
