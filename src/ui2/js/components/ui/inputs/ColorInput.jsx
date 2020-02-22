import React from 'react';
import { ButtonGroup, Intent, Button } from '@blueprintjs/core';

export default function ColorInput({ value, name, onChange }) {
  return (
    <ButtonGroup>
      <Button
        intent={Intent.PRIMARY}
      />
      <Button
        intent={Intent.WARNING}
      />
      <Button
        intent={Intent.DANGER}
      />
      <Button
        intent={Intent.SUCCESS}
      />
    </ButtonGroup>
  );
}
