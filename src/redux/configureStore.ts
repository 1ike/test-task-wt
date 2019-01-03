import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import forkReducer, { watchFetchForks } from '../ducks/git';

export interface IReduxState {
  appName: string;
}

const sagaMiddleware = createSagaMiddleware();

export default function(initialState = {}) {
  const rootReducer = combineReducers({
    forkReducer,
    appName: (state = '') => state,
  });

  //   return createStore(rootReducer, initialState, applyMiddleware(thunk));

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware),
  );
  sagaMiddleware.run(watchFetchForks);

  return store;
}
