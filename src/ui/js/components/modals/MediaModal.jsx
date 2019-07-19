import React from 'react';
import BaseModal from './BaseModal';

export default function(props) {
  const { outputs, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      dialogClassName="media-modal"
      relatedData={{
        outputs: outputs.map(({id, name}) => ({
          value: id,
          label: name,
        })),
      }}
      fields={[
        {
          label: 'Name',
          field: 'name',
          type: 'text',
        },
        {
          label: 'File',
          field: 'file',
          type: 'file',
        },
        {
          label: 'Output to',
          field: 'output',
          type: 'select',
          from: 'outputs',
        },
      ]}
    />
  );
};
