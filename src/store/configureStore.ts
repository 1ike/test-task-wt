import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

import forkReducer, { IForksState, watchFetchForks } from '../ducks/forks';

declare global {
  /* tslint:disable-next-line */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface IReduxState {
  appName: string;
  forks: IForksState;
}

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function(initialState = {}) {
  const rootReducer = combineReducers({
    form: formReducer.plugin({
      repoName: (state, action) => {
        switch (action.type) {
          case 'FORKS_SUCCESS':
            return undefined as undefined;
          default:
            return state;
        }
      },
    }),
    forks: forkReducer,
    appName: (state = '') => state,
  });

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(watchFetchForks);

  return store;
}
