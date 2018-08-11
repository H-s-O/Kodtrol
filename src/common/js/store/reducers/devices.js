export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_DEVICES':
      return payload;
      break;
      
    case 'CREATE_DEVICE':
      return [
        ...state,
        payload,
      ];
      break;
      
    case 'UPDATE_DEVICE':
      return state.map(it => it.id === payload.id ? payload : it);
      break;
      
    case 'DELETE_DEVICE':
      return state.filter(it => it.id !== payload);
      break;
      
    default:
      return state;
      break;
  }
}