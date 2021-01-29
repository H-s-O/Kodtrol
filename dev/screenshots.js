import { DIALOG_ADD } from '../src/common/js/constants/dialogs';
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
import {
  editScriptAction,
} from '../src/common/js/store/actions/scripts';

export default [
  {
    selector: '.browsers-tabs',
    file: 'devices_browser.png',
    clickIn: '#bp3-tab-title_browsers_devices',
  },
  {
    selector: '.browsers-tabs',
    file: 'scripts_browser.png',
    clickIn: '#bp3-tab-title_browsers_scripts',
  },
  {
    selector: '.browsers-tabs',
    file: 'medias_browser.png',
    clickIn: '#bp3-tab-title_browsers_medias',
  },
  {
    selector: '.browsers-tabs',
    file: 'timelines_browser.png',
    clickIn: '#bp3-tab-title_browsers_timelines',
  },
  {
    selector: '.browsers-tabs',
    file: 'boards_browser.png',
    clickIn: '#bp3-tab-title_browsers_boards',
  },
  {
    selector: '.device-dialog',
    file: 'add_device_dialog.png',
    dispatchIn: showDeviceDialogAction(DIALOG_ADD),
    dispatchOut: hideDeviceDialogAction(false),
  },
  {
    selector: '.script-dialog',
    file: 'add_script_dialog.png',
    dispatchIn: showScriptDialogAction(DIALOG_ADD),
    dispatchOut: hideScriptDialogAction(false),
  },
  {
    selector: '.media-dialog',
    file: 'add_media_dialog.png',
    dispatchIn: showMediaDialogAction(DIALOG_ADD),
    dispatchOut: hideMediaDialogAction(false),
  },
  {
    selector: '.timeline-dialog',
    file: 'add_timeline_dialog.png',
    dispatchIn: showTimelineDialogAction(DIALOG_ADD),
    dispatchOut: hideTimelineDialogAction(false),
  },
  {
    selector: '.board-dialog',
    file: 'add_board_dialog.png',
    dispatchIn: showBoardDialogAction(DIALOG_ADD),
    dispatchOut: hideBoardDialogAction(false),
  },
  {
    selector: '.scripts-tabs',
    file: 'scripts.png',
  },
  {
    selector: '.scripts-tabs',
    file: 'scripts_editor.png',
    dispatchIn: editScriptAction('A', { content: '' }),
    dispatchOut: hideBoardDialogAction(false),
  },
  {
    selector: '.timelines-boards-tabs',
    file: 'timelines_boards.png',
  },
];
