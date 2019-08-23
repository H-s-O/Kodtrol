export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_MEDIAS':
      return payload;
      break;
      
    case 'CREATE_MEDIA':
      return [
        ...state,
        payload,
      ];
      break;
      
    case 'DELETE_MEDIA':
      return state.filter(it => it.id !== payload);
      break;
      
    case 'SAVE_MEDIA':
      return state.map(it => it.id === payload.id ? {...it, ...payload.data} : it);
      break;
      
    default:
      return state;
      break;
  }
}