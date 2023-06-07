import { KodtrolState } from '../../../../common/types';

export default (state: KodtrolState): boolean => (
  !!state.runDevice
  || !!state.runScript
  || !!state.runTimeline
  || !!state.runBoard
);
