import React from 'react';
import BaseModal from './BaseModal';
import ChannelsTableField from './fields/ChannelsTableField';

export default function(props) {
  return (
    <BaseModal
      {...props}
      relatedData={{
        deviceTypes: [
          { id: 'dmx', label: 'DMX / ArtNet' },
          { id: 'serial', label: 'Serial' },
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
