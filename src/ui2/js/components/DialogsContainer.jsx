import React from 'react';

import DeviceDialog from './devices/DeviceDialog';
import AddScriptDialog from './scripts/ScriptDialog';
import MediaDialog from './medias/MediaDialog';

export default function DialogsContainer() {
  return (
    <>
      <DeviceDialog />
      <AddScriptDialog />
      <MediaDialog />
    </>
  );
}
