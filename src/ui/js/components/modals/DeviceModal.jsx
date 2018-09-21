import React from 'react';
import BaseModal from './BaseModal';
import ChannelsTableField from './fields/ChannelsTableField';

export default function(props) {
  return (
    <BaseModal
      {...props}
      relatedData={{
        deviceTypes: [
          { label: 'DMX / ArtNet', value: 'dmx' },
          { label: 'Serial', value: 'serial' },
        ],
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
          label: 'Device type',
          field: 'type',
          type: 'select',
          from: 'deviceTypes',
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
