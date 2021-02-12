import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, HTMLTable, Intent, Popover, Position, Colors } from '@blueprintjs/core';

import CheckboxInput from '../../ui/inputs/CheckboxInput';
import TextInput from '../../ui/inputs/TextInput';
import SelectInput from '../../ui/inputs/SelectInput';
import ColorInput from '../../ui/inputs/ColorInput';

const StyledTable = styled(HTMLTable)`
  tbody {
    display: block;
    max-height: 300px;
    overflow-y: auto;
  }

  td {
    vertical-align: middle !important;
  }

  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  thead {
    width: calc( 100% - 1em );
  }
`

const StyledColorIcon = styled.div`
  display: inline-block;
  width: 20px;
  height: 15px;
  margin-top: 2px;
  background-color: ${({ color }) => color};
  border: 1px solid ${Colors.DARK_GRAY2};
`

const TriggerRow = ({
  id,
  triggerNumber,
  name,
  layer,
  hotkey,
  color,
  layers,
  onDelete,
  onChange,
}) => {
  return (
    <tr>
      <td>
        {triggerNumber}
      </td>
      <td>
        <TextInput
          maxLength="1"
          value={hotkey}
          onChange={(value) => onChange(id, value, 'hotkey')}
        />
      </td>
      <td>
        <TextInput
          value={name}
          onChange={(value) => onChange(id, value, 'name')}
        />
      </td>
      <td>
        <SelectInput
          value={layer}
          onChange={(value) => onChange(id, value, 'layer')}
        >
          <option value="null">--</option>
          {layers.map((item, index) => {
            return (
              <option
                key={index}
                value={item.id}>
                {item.name}
              </option>
            )
          })}
        </SelectInput>
      </td>
      <td>
        <Popover
          position={Position.TOP}
          content={
            <ColorInput
              value={color}
              onChange={(value) => onChange(id, value, 'color')}
            />
          }
        >
          <Button
            small
            rightIcon="caret-down"
          >
            <StyledColorIcon color={color} />
          </Button>
        </Popover>
      </td>
      <td>
        <Button
          small
          intent={Intent.DANGER}
          icon="trash"
          onClick={() => onDelete(id)}
        />
      </td>
    </tr>
  )
};

export default function TriggersListInput({ value, name, layers, onChange }) {
  const displayValue = !value ? [] : value;

  const addHandler = useCallback(() => {
    if (typeof onChange === 'function') {
      onChange([...displayValue, { name: null, layer: null, hotkey: null, color: null }], name);
    }
  }, [onChange, name, displayValue]);
  const deleteHandler = useCallback((id) => {
    if (typeof onChange === 'function') {
      onChange(displayValue.filter((channel, index) => index !== id), name);
    }
  }, [onChange, name, displayValue]);
  const changeHandler = useCallback((id, fieldValue, fieldName) => {
    if (typeof onChange === 'function') {
      onChange(displayValue.map((channel, index) => index === id ? { ...channel, [fieldName]: fieldValue } : channel), name);
    }
  }, [onChange, name, displayValue]);

  return (
    <StyledTable
      bordered
      condensed
    >
      {displayValue.length > 0 && (
        <>
          <thead>
            <tr>
              <td>#</td>
              <td>Hotkey</td>
              <td>Name</td>
              <td>Layer</td>
              <td>Color</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {displayValue.map((trigger, index) => {
              return (
                <TriggerRow
                  key={index}
                  id={index}
                  triggerNumber={index + 1}
                  onDelete={deleteHandler}
                  onChange={changeHandler}
                  layers={layers}
                  {...trigger}
                />
              );
            })}
            <tr>
            </tr>
          </tbody>
        </>
      )}
      <tfoot>
        <tr>
          <td
            colSpan="5"
          >
            <Button
              small
              icon="plus"
              onClick={addHandler}
            />
          </td>
        </tr>
      </tfoot>
    </StyledTable>
  );
}
