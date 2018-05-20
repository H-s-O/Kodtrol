export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SCRIPTS':
      return {
        ...state,
        scripts: action.scripts.map((script) => {
          return {
            id: script.id,
            icon: 'file',
            label: `${script.name} (${script.id.substr(-5)})`,
            active: script.current,
          };
        }),
      };
      break;

    case 'UPDATE_DEVICES':
      return {
        ...state,
        devices: action.devices.map((device) => {
          return {
            id: device.id,
            icon: 'modal-window',
            label: `${device.name} (${device.id.substr(-5)})`,
          };
        }),
      };
      break;

    case 'UPDATE_TIMELINES':
      return {
        ...state,
        timelines: action.timelines.map((timeline) => {
          return {
            id: timeline.id,
            label: timeline.name,
            active: timeline.current,
          };
        }),
      };
      break;

    case 'UPDATE_TIMELINE_INFO':
      return {
        ...state,
        timelineInfo: action.timelineInfo,
      };
      break;

    case 'EDIT_SCRIPT':
      return {
        ...state,
        currentScript: action.currentScript,
      };
      break;

    case 'EDIT_TIMELINE':
      return {
        ...state,
        currentTimeline: action.currentTimeline,
      };
      break;

    default:
      return state;
      break;
  }
};
