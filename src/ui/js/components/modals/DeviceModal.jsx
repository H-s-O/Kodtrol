import React from 'react';
import BaseModal from './BaseModal';
import ChannelsTableField from './fields/ChannelsTableField';

export default function DeviceModal(props) {
  const { outputs, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      dialogClassName="device-modal"
      relatedData={{
        outputs: outputs.filter(({type}) => type !== 'audio').map(({id, name}) => ({
          value: id,
          label: name,
        })),
        types: [
          { value: 'dmx', label: 'DMX' },
          { value: 'ilda', label: 'ILDA' },
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
          label: 'Type',
          field: 'type',
          type: 'select',
          from: 'types',
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
          placeholder: '1 - 512',
          min: 1,
          max: 512,
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
