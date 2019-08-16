import React from 'react';
import BaseModal from './BaseModal';

export default function BoardModal(props) {
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
          placeholder: '1 - 300',
          min: 1,
          max: 300,
        },
      ]}
    />
  );
};
