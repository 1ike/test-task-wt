import { combineReducers, Reducer } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../services/API';
import { FetchingState, ErrorMessage, IRepo, RouteName } from '../constants';

/**
 * INTERFACES / TYPE
 */

export interface IUser {
  uid: string;
}

export interface IUserState {
  item: IUser;
  fetchingState: FetchingState;
  errorMessage: ErrorMessage;
}

/**
 * CONSTANTS
 */

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export const CLOSE_ERROR_MESSAGE = 'CLOSE_ERROR_MESSAGE';

export const FETCH_USER = 'FETCH_USER';

/**
 * ACTION CREATORS
 */

export const userRequest = createAction(USER_REQUEST);
export const userSuccess = createAction(USER_SUCCESS);
export const userFailure = createAction(USER_FAILURE);

export const closeErrorMessage = createAction(CLOSE_ERROR_MESSAGE);

export const fetchUser = createAction(FETCH_USER);

/*
 * SAGAS
 */

export function* watchFetchUser() {
  yield takeEvery(FETCH_USER, fetchUserAsync);
}

export function* fetchUserAsync() {
  try {
    yield put(userRequest());
    const userResponse = yield call(API.fetchFavourites);
    console.log(userResponse);
    yield put(
      userSuccess({
        user: userResponse,
      })
    );
  } catch (error) {
    console.error(error);
    yield put(userFailure(error.message));
  }
}

/**
 * REDUCERS
 */

const fetchingState = handleActions(
  {
    [userRequest.toString()]() {
      return FetchingState.Requested;
    },
    [userFailure.toString()](): FetchingState {
      return FetchingState.Failed;
    },
    [userSuccess.toString()](): FetchingState {
      return FetchingState.Successed;
    },
  },
  FetchingState.None
);

const item = handleActions(
  {
    [userSuccess.toString()](
      state: IUser,
      { payload: { user } }: Action<{ user: IUser }>
    ): IUser {
      return user;
    },
  },
  {}
);

const errorMessage = handleActions(
  {
    [userFailure.toString()](state, { payload: message }): ErrorMessage {
      return message;
    },
    [closeErrorMessage.toString()](state): ErrorMessage {
      return '';
    },
  },
  ''
);

export default combineReducers({
  item,
  fetchingState,
  errorMessage,
});
