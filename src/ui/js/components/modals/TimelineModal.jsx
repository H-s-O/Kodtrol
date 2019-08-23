import React from 'react';

import BaseModal from './BaseModal';

export default function TimelineModal(props) {
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
        {
          label: 'Duration',
          field: 'duration',
          type: 'number',
          placeholder: '1 - ∞',
          min: 1,
        },
        {
          label: 'In time',
          field: 'inTime',
          type: 'number',
          placeholder: '0 - ∞',
          min: 0,
        },
        {
          label: 'Out time',
          field: 'outTime',
          type: 'number',
          placeholder: '1 - ∞',
          min: 1,
        },
      ]}
    />
  );
};
