import React, { useCallback } from 'react';
import { Button, Intent, HTMLTable, ButtonGroup } from '@blueprintjs/core';

import TextInput from '../ui/inputs/TextInput';
import NumberInput from '../ui/inputs/NumberInput';
import styled from 'styled-components';
import CheckboxInput from '../ui/inputs/CheckboxInput';

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

const ChannelRow = ({
  id,
  channelNumber,
  alias,
  defaultValue,
  testValue,
  onDelete,
  onChange,
  onMoveUp,
  onMoveDown,
  disableUp = false,
  disableDown = false
}) => {
  return (
    <tr>
      <td>
        {channelNumber}
      </td>
      <td>
        <TextInput
          value={alias}
          onChange={(value) => onChange(id, value, 'alias')}
        />
      </td>
      <td>
        <NumberInput
          fill
          min={0}
          max={255}
          placeholder="0"
          value={defaultValue}
          onChange={(value) => onChange(id, value, 'defaultValue')}
        />
      </td>
      <td>
        <NumberInput
          fill
          min={0}
          max={255}
          placeholder="0"
          value={testValue}
          onChange={(value) => onChange(id, value, 'testValue')}
        />
      </td>
      <td>
        <ButtonGroup>
          <Button
            small
            icon="arrow-up"
            disabled={disableUp}
            onClick={() => onMoveUp(id)}
          />
          <Button
            small
            icon="arrow-down"
            disabled={disableDown}
            onClick={() => onMoveDown(id)}
          />
          <Button
            small
            intent={Intent.DANGER}
            icon="trash"
            onClick={() => onDelete(id)}
          />
        </ButtonGroup>
      </td>
    </tr>
  );
}

export default function DmxChannelsInput({ value, name, onChange }) {
  const displayValue = !value ? [] : value;

  const addHandler = useCallback(() => {
    if (typeof onChange === 'function') {
      onChange([...displayValue, { alias: null, defaultValue: null, testValue: null }], name);
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
  const moveUpHandler = useCallback((id) => {
    if (typeof onChange === 'function') {
      const newValue = [...displayValue];
      const removed = newValue.splice(id, 1)[0];
      newValue.splice(id - 1, 0, removed);
      onChange(newValue, name);
    }
  }, [onChange, name, displayValue]);
  const moveDownHandler = useCallback((id) => {
    if (typeof onChange === 'function') {
      const newValue = [...displayValue];
      const removed = newValue.splice(id, 1)[0];
      newValue.splice(id + 1, 0, removed);
      onChange(newValue, name);
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
              <td>Name</td>
              <td>Default value</td>
              <td>Test value</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {displayValue.map((channel, index) => {
              return (
                <ChannelRow
                  key={index}
                  id={index}
                  channelNumber={index + 1}
                  disableUp={index === 0}
                  disableDown={index === displayValue.length - 1}
                  onDelete={deleteHandler}
                  onChange={changeHandler}
                  onMoveUp={moveUpHandler}
                  onMoveDown={moveDownHandler}
                  {...channel}
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
