import { unselectTimeline } from '../actions/timelines';
import { unselectBoard } from '../actions/boards';

export default () => {
  return store => next => action => {
    if (
      action.type === 'SELECT_TIMELINE'
      && action.payload !== null
      && store.getState().currentBoard !== null
    ) {
      store.dispatch(unselectBoard());
    } else if (
      action.type === 'SELECT_BOARD'
      && action.payload !== null
      && store.getState().currentTimeline !== null
    ) {
      store.dispatch(unselectTimeline());
    }
    return next(action);
  };
};
