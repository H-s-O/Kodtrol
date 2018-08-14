export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_TIMELINES':
      return payload;
      break;
      
    case 'CREATE_TIMELINE':
      return [
        ...state,
        payload,
      ];
      break;
      
    case 'UPDATE_TIMELINE':
      return state.map(it => it.id === payload.id ? payload : it);
      break;
      
    case 'DELETE_TIMELINE':
      return state.filter(it => it.id !== payload);
      break;
      
    default:
      return state;
      break;
  }
};