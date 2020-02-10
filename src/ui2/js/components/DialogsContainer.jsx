import React from 'react';

import DeviceDialog from './devices/DeviceDialog';
import AddScriptDialog from './scripts/ScriptDialog';
import MediaDialog from './medias/MediaDialog';
import TimelineDialog from './timelines/TimelineDialog';
import BoardDialog from './boards/BoardDialog';
import ProjectConfigDialog from './project/ProjectConfigDialog';

export default function DialogsContainer() {
  return (
    <>
      <DeviceDialog />
      <AddScriptDialog />
      <MediaDialog />
      <TimelineDialog />
      <BoardDialog />
      <ProjectConfigDialog />
    </>
  );
}
