export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_SCRIPTS':
      return payload;
      break;
      
    case 'CREATE_SCRIPT':
      return [
        ...state,
        payload,
      ];
      break;
      
    case 'DELETE_SCRIPT':
      return state.filter(it => it.id !== payload);
      break;
      
    case 'SAVE_SCRIPT':
      return state.map(it => it.id === payload.id ? {...it, ...payload.data} : it);
      break;
      
    default:
      return state;
      break;
  }
}