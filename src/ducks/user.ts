import { combineReducers } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../services/API';
import { createErrorMessage } from '../services/helpers';
import { RequestState, ErrorMessage } from '../constants';
import { fetchFavourites } from './favourites';
import { addError } from './errors';

/**
 * INTERFACES / TYPE
 */

export interface IUser {
  uid: string;
}

export type User = IUser | {};

export interface IUserState {
  item: User;
  fetchingState: RequestState;
  logoutState: RequestState;
  errorMessage: ErrorMessage;
}

export interface IUserPayload {
  user: IUser;
}

/**
 * CONSTANTS
 */

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const USER_ERROR_MESSAGE = 'USER_ERROR_MESSAGE';

export const FETCH_USER = 'FETCH_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

/**
 * ACTION CREATORS
 */

export const userRequest = createAction<void>(USER_REQUEST);
export const userSuccess = createAction<IUserPayload>(USER_SUCCESS);
export const userFailure = createAction<void>(USER_FAILURE);

export const logoutRequest = createAction<void>(LOGOUT_REQUEST);
export const logoutSuccess = createAction<void>(LOGOUT_SUCCESS);
export const logoutFailure = createAction<void>(LOGOUT_FAILURE);

export const userErrorMessage = createAction<void>(USER_ERROR_MESSAGE);

export const fetchUser = createAction<void>(FETCH_USER);
export const logoutUser = createAction<void>(LOGOUT_USER);

/*
 * SAGAS
 */

export function* watchFetchUser() {
  yield takeEvery(FETCH_USER, fetchUserAsync);
}

export function* fetchUserAsync() {
  try {
    yield put(userRequest());
    const user: IUser = yield call(API.fetchUser);
    yield put(userSuccess({ user }));
    yield put(fetchFavourites());
  } catch (error) {
    console.error(error);
    yield put(userFailure());
    yield put(addError(createErrorMessage('Login', error.message)));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logoutUserAsync);
}

export function* logoutUserAsync() {
  try {
    yield put(logoutRequest());
    yield call(API.logoutUser);
    yield put(logoutSuccess());
  } catch (error) {
    console.error(error);
    yield put(logoutFailure());
    yield put(addError(createErrorMessage('Logout', error.message)));
  }
}

/**
 * REDUCERS
 */

const fetchingState = handleActions(
  {
    [userRequest.toString()](): RequestState {
      return RequestState.Requested;
    },
    [userFailure.toString()](): RequestState {
      return RequestState.Failed;
    },
    [userSuccess.toString()](): RequestState {
      return RequestState.Successed;
    },
  },
  RequestState.None
);

const logoutState = handleActions(
  {
    [logoutRequest.toString()](): RequestState {
      return RequestState.Requested;
    },
    [logoutFailure.toString()](): RequestState {
      return RequestState.Failed;
    },
    [logoutSuccess.toString()](): RequestState {
      return RequestState.Successed;
    },
  },
  RequestState.None
);

const item = (state: User = {}, action: Action<IUserPayload>): User => {
  switch (action.type) {
    case userSuccess.toString():
      return action.payload.user;
    case logoutSuccess.toString():
      return {};
    default:
      return state;
  }
};

const errorMessage = handleActions(
  {
    [userFailure.toString()](state, { payload: message }): ErrorMessage {
      return message;
    },
    [userErrorMessage.toString()](): ErrorMessage {
      return '';
    },
  },
  ''
);

export default combineReducers({
  item,
  fetchingState,
  logoutState,
});
