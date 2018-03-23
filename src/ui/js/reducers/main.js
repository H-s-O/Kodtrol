export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SCRIPTS':
      // console.log('UPDATE_SCRIPTS', action);
      return {
        ...state,
        scripts: action.scripts.map((script) => {
          return {
            icon: 'file',
            label: script.name,
          };
        }),
      };
      break;

    default:
      return state;
      break;
  }
};
