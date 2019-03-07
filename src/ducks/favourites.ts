import { combineReducers, Reducer } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../services/API';
import { FetchingState, ErrorMessage, IRepo, RouteName } from '../constants';
import { redirectTo, createRelativePath } from '../services/helpers';

/**
 * INTERFACES / TYPE
 */

export interface IFavourite {
  fork: IRepo;
  source: IRepo;
}
export type Favourites = IFavourite[];

export interface IFavouritesState {
  items: Favourites;
  // page: number;
  // perPage: number;
  fetchingState: FetchingState;
  errorMessage: ErrorMessage;
  managingState: FetchingState;
}

export interface IFavouritesPayload {
  favourites: Favourites;
}
export interface IFavouritePayload {
  favourite: IFavourite;
  manageAction: ManageAction;
}
// type IItemsPayload = IFavouritesPayload | IFavouritePayload;
interface IItemsPayload extends IFavouritesPayload, IFavouritePayload {}

/**
 * CONSTANTS
 */

// export const FAVOURITES_PAGE = 1;
// export const FAVOURITES_PER_PAGE = 10;

export const FAVOURITES_REQUEST = 'FAVOURITES_REQUEST';
export const FAVOURITES_SUCCESS = 'FAVOURITES_SUCCESS';
export const FAVOURITES_FAILURE = 'FAVOURITES_FAILURE';

export const FAVOURITE_REQUEST = 'FAVOURITE_REQUEST';
export const FAVOURITE_SUCCESS = 'FAVOURITE_SUCCESS';
export const FAVOURITE_FAILURE = 'FAVOURITE_FAILURE';

export const CLOSE_ERROR_MESSAGE = 'CLOSE_ERROR_MESSAGE';

export const FETCH_FAVOURITES = 'FETCH_FAVOURITES';

export const ADD_FAVOURITE = 'ADD_FAVOURITE';
export const DELETE_FAVOURITE = 'DELETE_FAVOURITE';
export const MANAGE_FAVOURITE = 'MANAGE_FAVOURITE';

export enum ManageAction {
  Add = 'addFavourite',
  Delete = 'deleteFavourite',
}

/**
 * ACTION CREATORS
 */

export const favouritesRequest = createAction(FAVOURITES_REQUEST);
export const favouritesSuccess = createAction(FAVOURITES_SUCCESS);
export const favouritesFailure = createAction(FAVOURITES_FAILURE);

export const favouriteRequest = createAction(FAVOURITE_REQUEST);
export const favouriteSuccess = createAction(FAVOURITE_SUCCESS);
export const favouriteFailure = createAction(FAVOURITE_FAILURE);

export const closeErrorMessage = createAction(CLOSE_ERROR_MESSAGE);

export const fetchFavourites = createAction(FETCH_FAVOURITES);
// export const addFavourite = createAction(ADD_FAVOURITE);
// export const deleteFavourite = createAction(DELETE_FAVOURITE);
export const manageFavourite = createAction(MANAGE_FAVOURITE);

/*
 * SAGAS
 */

export function* watchFetchFavourites() {
  yield takeEvery(FETCH_FAVOURITES, fetchFavouritesAsync);
}

export function* fetchFavouritesAsync({
  payload: {
    // page = FAVOURITES_PAGE,
    // perPage = FAVOURITES_PER_PAGE,
  },
}: Action<{
  // page: number;
  // perPage: number;
}>) {
  try {
    yield put(favouritesRequest());
    const favouritesResponse = yield call(
      API.fetchFavourites
      // page,
      // perPage
    );
    console.log(favouritesResponse);
    yield put(
      favouritesSuccess({
        favourites: favouritesResponse,
        // page,
        // perPage,
      })
    );
  } catch (error) {
    console.error(error);
    yield put(favouritesFailure(error.message));
  }
}

export function* watchManageFavourite() {
  yield takeEvery(MANAGE_FAVOURITE, manageFavouriteAsync);
}

export function* manageFavouriteAsync({
  payload: { favourite, manageAction },
}: Action<IFavouritePayload>) {
  try {
    yield put(favouriteRequest());
    const favouriteResponse = yield call(API[manageAction], favourite);
    console.log(favouriteResponse);
    yield put(
      favouriteSuccess({
        favourite: favouriteResponse,
        manageAction,
      })
    );
  } catch (error) {
    console.error(error);
    yield put(favouriteFailure(error.message));
  }
}

/**
 * REDUCERS
 */

const fetchingState = handleActions(
  {
    [favouritesRequest.toString()]() {
      return FetchingState.Requested;
    },
    [favouritesFailure.toString()](): FetchingState {
      return FetchingState.Failed;
    },
    [favouritesSuccess.toString()](): FetchingState {
      return FetchingState.Successed;
    },
  },
  FetchingState.None
);

const managingState = handleActions(
  {
    [favouriteRequest.toString()]() {
      return FetchingState.Requested;
    },
    [favouriteFailure.toString()](): FetchingState {
      return FetchingState.Failed;
    },
    [favouriteSuccess.toString()](): FetchingState {
      return FetchingState.Successed;
    },
  },
  FetchingState.None
);

const items: Reducer<Favourites, Action<IItemsPayload>> = handleActions(
  {
    [favouritesSuccess.toString()](
      state: Favourites,
      { payload: { favourites } }: Action<IItemsPayload>
    ): Favourites {
      return favourites;
    },
    [favouriteSuccess.toString()](
      state: Favourites,
      { payload: { favourite, manageAction } }: Action<IItemsPayload>
    ): Favourites {
      return manageAction === ManageAction.Add
        ? [...state, favourite]
        : state.filter((item) => item.fork.id !== favourite.fork.id);
    },
  },
  []
);

/* const favouritesPage = handleActions(
  {
    [favouritesSuccess.toString()](
      state,
      { payload: { page } }: Action<{ page: number }>
    ) {
      return page || state;
    },
  },
  FAVOURITES_PAGE
);

const favouritesPerPage = handleActions(
  {
    [favouritesSuccess.toString()](
      state,
      { payload: { perPage } }: Action<{ perPage: number }>
    ) {
      return perPage || state;
    },
  },
  FAVOURITES_PER_PAGE
); */

const errorMessage = handleActions(
  {
    [favouritesFailure.toString()](state, { payload: message }): ErrorMessage {
      return message;
    },
    [closeErrorMessage.toString()](state): ErrorMessage {
      return '';
    },
  },
  ''
);

export default combineReducers({
  items,
  // page: favouritesPage,
  // perPage: favouritesPerPage,
  fetchingState,
  errorMessage,
  managingState,
});
