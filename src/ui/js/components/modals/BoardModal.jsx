import React from 'react';
import BaseModal from './BaseModal';

export default function(props) {
  return (
    <BaseModal
      {...props}
      fields={[
        {
          label: 'Name',
          field: 'name',
          type: 'text',
        },
        {
          label: 'Tempo',
          field: 'tempo',
          type: 'number',
        },
      ]}
    />
  );
};
