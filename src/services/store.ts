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

store.dispatch(fetchFavourites());

export default store;
