import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

import forksReducer, { IForksState, watchFetchForks } from '../ducks/forks';
import favouritesReducer, {
  IFavouritesState,
  watchFetchFavourites,
  watchManageFavourite
} from '../ducks/favourites';
import userReducer, {
  IUserState,
  fetchUser,
  watchFetchUser,
  watchLogoutUser
} from '../ducks/user';
import appNameReducer from '../ducks/appName';
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

export const sagaMiddleware = createSagaMiddleware();

if (typeof window === 'undefined') {
  /* tslint:disable-next-line */
  var window = {} as Window;
}
const composeEnhancers =
  (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

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
