import React from 'react';

import AddDeviceDialog from './devices/dialogs/AddDeviceDialog';
import EditDeviceDialog from './devices/dialogs/EditDeviceDialog';
import AddScriptDialog from './scripts/dialogs/AddScriptDialog';

export default function DialogsContainer() {
  return (
    <>
      <AddDeviceDialog />
      <EditDeviceDialog />
      <AddScriptDialog />
    </>
  );
}
