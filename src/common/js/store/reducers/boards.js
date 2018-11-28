export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_BOARDS':
      return payload;
      break;
      
    case 'CREATE_BOARD':
      return [
        ...state,
        payload,
      ];
      break;
      
    case 'UPDATE_BOARD':
      return state.map(it => it.id === payload.id ? payload : it);
      break;
      
    case 'DELETE_BOARD':
      return state.filter(it => it.id !== payload);
      break;
      
    case 'SAVE_BOARD':
      return state.map(it => it.id === payload.id ? payload : it);
      break;
      
    default:
      return state;
      break;
  }
};