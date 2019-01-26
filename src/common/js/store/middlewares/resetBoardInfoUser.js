import { updateBoardInfoUser } from '../actions/boardInfo';

export default () => {
  return store => next => action => {
    if (
      action.type === 'UPDATE_BOARD_INFO'
      && action.payload !== null
      && store.getState().boardInfoUser !== null
    ) {
      store.dispatch(updateBoardInfoUser(null));
    }
    return next(action);
  };
};
