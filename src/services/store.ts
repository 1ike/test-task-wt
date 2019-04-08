import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

import forksReducer, { IForksState } from '../ducks/forks';
import favouritesReducer, { IFavouritesState } from '../ducks/favourites';
import userReducer, { IUserState } from '../ducks/user';
import appNameReducer from '../ducks/appName';
import errorsReducer from '../ducks/errors';
import { ErrorMessage } from '../constants';

declare global {
  /* tslint:disable-next-line */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    __PRELOADED_STATE__?: string;
  }
}
export const inBrowser = typeof window !== 'undefined';
/* tslint:disable-next-line */
const windowGlobal = inBrowser ? window : ({} as Window);

export const preloadedState = windowGlobal.__PRELOADED_STATE__;
const composeEnhancers =
  windowGlobal.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface IReduxState {
  appName: string;
  forks: IForksState;
  favourites: IFavouritesState;
  user: IUserState;
  errors: ErrorMessage;
}

export const sagaMiddleware = createSagaMiddleware();

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
  forks: forksReducer,
  favourites: favouritesReducer,
  user: userReducer,
  errors: errorsReducer,
  appName: appNameReducer,
});

export default (initialState = {}) =>
  createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
