import React from 'react';
import BaseModal from './BaseModal';
import ChannelsTableField from './fields/ChannelsTableField';

export default function(props) {
  const { outputs, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
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
          label: 'Group(s)',
          field: 'groups',
          type: 'text',
        },
        {
          label: 'Output to',
          field: 'output',
          type: 'select',
          from: 'outputs',
        },
        {
          label: 'Starting channel',
          field: 'startChannel',
          type: 'number',
        },
        {
          label: 'Channels',
          field: 'channels',
          type: ChannelsTableField,
          from: 'channels',
        },
      ]}
    />
  );
};
