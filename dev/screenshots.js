import {
  showDeviceDialogAction,
  hideDeviceDialogAction,
  showScriptDialogAction,
  hideScriptDialogAction,
  showMediaDialogAction,
  hideMediaDialogAction,
  showTimelineDialogAction,
  hideTimelineDialogAction,
  showBoardDialogAction,
  hideBoardDialogAction,
} from '../src/common/js/store/actions/dialogs';

export default [
  {
    selector: '.device-dialog',
    file: 'add_device_dialog.png',
    dispatchIn: showDeviceDialogAction('add', {}, false),
    dispatchOut: hideDeviceDialogAction(false),
  },
  {
    selector: '.script-dialog',
    file: 'add_script_dialog.png',
    dispatchIn: showScriptDialogAction('add', {}, false),
    dispatchOut: hideScriptDialogAction(false),
  },
  {
    selector: '.media-dialog',
    file: 'add_media_dialog.png',
    dispatchIn: showMediaDialogAction('add', {}, false),
    dispatchOut: hideMediaDialogAction(false),
  },
  {
    selector: '.timeline-dialog',
    file: 'add_timeline_dialog.png',
    dispatchIn: showTimelineDialogAction('add', {}, false),
    dispatchOut: hideTimelineDialogAction(false),
  },
  {
    selector: '.board-dialog',
    file: 'add_board_dialog.png',
    dispatchIn: showBoardDialogAction('add', {}, false),
    dispatchOut: hideBoardDialogAction(false),
  },
];
