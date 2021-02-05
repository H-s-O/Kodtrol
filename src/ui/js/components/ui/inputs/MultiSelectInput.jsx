import React, { useCallback, useMemo } from 'react';
import { MultiSelect } from '@blueprintjs/select';
import { MenuItem, Position } from '@blueprintjs/core';

export default function MultiSelectInput({ value, name, onChange, items, ...otherProps }) {
  const displayValue = !value ? [] : value;

  const itemsLabels = useMemo(() => {
    return items.reduce((obj, { label, value }) => ({
      ...obj,
      [value]: label,
    }), {});
  }, [items]);

  const itemRenderer = useCallback((item, { modifiers, handleClick }) => {
    return (
      <MenuItem
        key={item.value}
        icon={displayValue.includes(item.value) ? 'tick' : 'blank'}
        active={modifiers.active}
        text={item.label}
        onClick={handleClick}
        shouldDismissPopover={false}
      />
    );
  }, [displayValue]);
  const tagRenderer = useCallback((item) => {
    return itemsLabels[item];
  }, [itemsLabels])

  const itemSelectHandler = useCallback((item) => {
    if (typeof onChange === 'function') {
      if (displayValue.includes(item.value)) {
        onChange(displayValue.filter((value) => value !== item.value), name);
      } else {
        onChange([...displayValue, item.value], name);
      }
    }
  }, [onChange, displayValue, name]);
  const removeTagHandler = useCallback((tag, index) => {
    if (typeof onChange === 'function') {
      onChange(displayValue.filter((value, idx) => idx !== index), name);
    }
  }, [onChange, displayValue, name]);

  return (
    <MultiSelect
      items={items}
      selectedItems={displayValue}
      itemsEqual="value"
      itemRenderer={itemRenderer}
      tagRenderer={tagRenderer}
      onItemSelect={itemSelectHandler}
      popoverProps={{
        minimal: true,
        position: Position.BOTTOM,
      }}
      tagInputProps={{
        onRemove: removeTagHandler,
      }}
      {...otherProps}
    />
  );
}
