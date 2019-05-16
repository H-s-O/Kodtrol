import { updateDeviceModal } from '../src/common/js/store/actions/modals';

export default [
    {
        selector: '*[data-screenshot-id="devices-browser"]',
        file: 'devices_browser.png',
    },
    {
        selector: '*[data-screenshot-id="devices-browser-add"]',
        file: 'devices_browser_add.png',
    },
    {
        selector: '.device-modal',
        file: 'add_device_modal.png',
        dispatchIn: updateDeviceModal('add', {}, false),
        dispatchOut: updateDeviceModal(null, null, false),
    },
    {
        selector: '*[data-screenshot-id="scripts-browser"]',
        file: 'scripts_browser.png',
    },
    {
        selector: '*[data-screenshot-id="timelines-boards-browser"]',
        file: 'timelines_boards_browser.png',
    },
];