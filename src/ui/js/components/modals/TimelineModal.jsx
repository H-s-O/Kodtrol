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
        },
        {
          label: 'Duration',
          field: 'duration',
          type: 'number',
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
      ]}
    />
  );
};
