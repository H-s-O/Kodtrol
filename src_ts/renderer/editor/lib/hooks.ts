import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { KodtrolState } from '../../../common/types';
import { DispatchFunc } from '../components/Root';

export const useKodtrolDispatch: DispatchFunc = useDispatch;
export const useKodtrolSelector: TypedUseSelectorHook<KodtrolState> = useSelector;
