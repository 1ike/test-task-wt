import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

import forksReducer, { IForksState, watchFetchForks } from '../ducks/forks';
import favouritesReducer, {
  IFavouritesState,
  watchFetchFavourites,
  fetchFavourites,
  watchManageFavourite
} from '../ducks/favourites';
import userReducer, {
  IUserState,
  fetchUser,
  watchFetchUser,
  watchLogoutUser
} from '../ducks/user';
import errorsReducer from '../ducks/errors';
import { ErrorMessage } from '../constants';

declare global {
  /* tslint:disable-next-line */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface IReduxState {
  appName: string;
  forks: IForksState;
  favourites: IFavouritesState;
  user: IUserState;
  errors: ErrorMessage;
}

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

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
  appName: (state = '') => state,
});

export const initialState = { appName: 'WebTouch test job' };

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(watchFetchForks);
sagaMiddleware.run(watchFetchFavourites);
sagaMiddleware.run(watchManageFavourite);
sagaMiddleware.run(watchFetchUser);
sagaMiddleware.run(watchLogoutUser);

store.dispatch(fetchUser());

export default store;
