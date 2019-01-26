import { updateBoardInfo } from '../actions/boardInfo';

export default () => {
  return store => next => action => {
    if (
      action.type === 'RUN_BOARD'
      && action.payload === null
    ) {
      store.dispatch(updateBoardInfo({
      }));
    }
    return next(action);
  };
};
