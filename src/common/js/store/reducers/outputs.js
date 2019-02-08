export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_OUTPUTS':
      return payload;
      break;
      
    case 'CREATE_OUTPUT':
      return [
        ...state,
        payload,
      ];
      break;
      
    case 'DELETE_OUTPUT':
      return state.filter(it => it.id !== payload);
      break;
      
    case 'SAVE_OUTPUT':
      return state.map(it => it.id === payload.id ? {...it, ...payload.data} : it);
      break;
      
    default:
      return state;
      break;
  }
}