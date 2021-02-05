import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup, HTMLTable, Intent, MenuItem } from '@blueprintjs/core';

import SelectInput from '../ui/inputs/SelectInput';

// import SelectSearchInput from '../ui/inputs/SelectSearchInput';

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

// const deviceMenuRenderer = (item, { handleClick, modifiers, query }) => {
//   return (
//     <MenuItem
//       text="asdasd"
//     />
//   )
// };

const DeviceRow = ({
  device,
  index,
  deviceNumber,
  onChange,
  disableUp,
  disableDown,
  onMoveUp,
  onMoveDown,
  onDelete,
  devices,
}) => {
  return (
    <tr>
      <td>
        {deviceNumber}
      </td>
      <td>
        <SelectInput
          value={device}
          onChange={(value) => onChange(index, value, 'device')}
        >
          <option value="null">--</option>
          {devices.map((device, index) => {
            return (
              <option
                key={index}
                value={device.id}>
                {device.name}
              </option>
            )
          })}
        </SelectInput>
      </td>
      <td>
        <ButtonGroup>
          <Button
            small
            icon="arrow-up"
            disabled={disableUp}
            onClick={() => onMoveUp(index)}
          />
          <Button
            small
            icon="arrow-down"
            disabled={disableDown}
            onClick={() => onMoveDown(index)}
          />
          <Button
            small
            intent={Intent.DANGER}
            icon="trash"
            onClick={() => onDelete(index)}
          />
        </ButtonGroup>
      </td>
    </tr>
  )
};

export default function ScriptDevicesInput({ value, name, onChange, devices }) {
  const displayValue = !value ? [] : value;

  const addHandler = useCallback(() => {
    if (typeof onChange === 'function') {
      onChange([...displayValue, { device: null }], name);
    }
  }, [onChange, name, displayValue]);
  const deleteHandler = useCallback((id) => {
    if (typeof onChange === 'function') {
      onChange(displayValue.filter((device, index) => index !== id), name);
    }
  }, [onChange, name, displayValue]);
  const changeHandler = useCallback((id, fieldValue, fieldName) => {
    if (typeof onChange === 'function') {
      onChange(displayValue.map((device, index) => index === id ? { ...device, [fieldName]: fieldValue } : device), name);
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
      condensed
      bordered
    >
      {displayValue.length > 0 && (
        <>
          <thead>
            <tr>
              <td>#</td>
              <td>Device</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {displayValue.map((device, index) => {
              return (
                <DeviceRow
                  key={index}
                  index={index}
                  deviceNumber={index + 1}
                  devices={devices}
                  disableUp={index === 0}
                  disableDown={index === displayValue.length - 1}
                  onDelete={deleteHandler}
                  onChange={changeHandler}
                  onMoveUp={moveUpHandler}
                  onMoveDown={moveDownHandler}
                  {...device}
                />
              );
            })}
          </tbody>
        </>
      )}
      <tfoot>
        <tr>
          <td
            colSpan="3"
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
