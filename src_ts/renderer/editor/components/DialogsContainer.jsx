import React from 'react';

import DeviceDialog from './devices/DeviceDialog';
import ScriptDialog from './scripts/ScriptDialog';
import MediaDialog from './medias/MediaDialog';
import TimelineDialog from './timelines/TimelineDialog';
import BoardDialog from './boards/BoardDialog';
import ProjectConfigDialog from './project/ProjectConfigDialog';
import ImportDialog from './ImportDialog';

export default function DialogsContainer() {
  return (
    <>
      <DeviceDialog />
      <ScriptDialog />
      <MediaDialog />
      <TimelineDialog />
      <BoardDialog />
      <ProjectConfigDialog />
      <ImportDialog />
    </>
  );
}
