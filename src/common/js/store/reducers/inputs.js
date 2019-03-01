export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_INPUTS':
      return payload;
      break;
      
    case 'CREATE_INPUT':
      return [
        ...state,
        payload,
      ];
      break;
      
    case 'DELETE_INPUT':
      return state.filter(it => it.id !== payload);
      break;
      
    case 'SAVE_INPUT':
      return state.map(it => it.id === payload.id ? {...it, ...payload.data} : it);
      break;
      
    default:
      return state;
      break;
  }
}