import React from 'react';

import BaseModal from '../../modals/BaseModal';

export default function(props) {
  const { scripts, layers, ...otherProps } = props;
  return (
    <BaseModal
      {...otherProps}
      relatedData={{
        scripts: scripts.map(({id, name}) => ({
          value: id,
          label: name,
        })),
        layers: layers.map(({id, order}) => ({
          value: id,
          label: order + 1,
        })),
        types: [
          { value: 'trigger_once', label: 'Trigger once' },
          //{ value: 'trigger_mult', label: 'Trigger multiple' }, unsupported for now
          { value: 'toggle', label: 'Toggle' },
        ],
        triggers: [
          { value: 'midi_cc', label: 'MIDI CC value 0/127'},
          { value: 'midi_note', label: 'MIDI note on/off' },
        ],
      }}
      fields={[
        {
          label: 'Script',
          field: 'script',
          type: 'select',
          from: 'scripts',
        },
        {
          label: 'Layer',
          field: 'layer',
          type: 'select',
          from: 'layers',
        },
        {
          label: 'Name',
          field: 'name',
          type: 'text',
          placeholder: '(optional)',
        },
        {
          label: 'Type',
          field: 'type',
          type: 'select',
          from: 'types',
        },
        {
          label: 'External trigger',
          field: 'trigger',
          type: 'select',
          from: 'triggers',
        },
        {
          label: 'Trigger source',
          field: 'triggerSource',
          type: 'text',
          placeholder: '(optional)',
        },
        {
          label: 'Lead-in time',
          field: 'leadInTime',
          type: 'number',
          placeholder: '(optional, default: 0)'
        },
        {
          label: 'Lead-out time',
          field: 'leadOutTime',
          type: 'number',
          placeholder: '(optional, default: 0)'
        },
        {
          label: 'Color',
          field: 'color',
          type: 'color',
        },
      ]}
    />
  );
}
