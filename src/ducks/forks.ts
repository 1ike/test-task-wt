import { combineReducers } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../API';

// import counterReducer from './reducers/counterReducer';

/**
 * ACTION CREATORS
 */

export const forksRequest = createAction('FORKS_REQUEST');
export const forksSuccess = createAction('FORKS_SUCCESS');
export const forksFailure = createAction('FORKS_FAILURE');

export const closeErrorMessage = createAction('CLOSE_ERROR_MESSAGE');

export const fetchForks = createAction('FETCHED_FORKS');

/**
 * SAGAS
 */

export function* watchFetchForks() {
  yield takeEvery('FETCHED_FORKS', fetchForksAsync);
}

export function* fetchForksAsync(
  action: Action<{
    repoName: string;
  }>
) {
  try {
    yield put(forksRequest());
    const response = yield call(API.fetchForks, action.payload.repoName);
    console.log(response);
    yield put(forksSuccess(response.data));
  } catch (error) {
    console.log(error);
    yield put(forksFailure(error.message));
  }
}

/**
 * REDUCERS
 */

const forksFetchingState = handleActions(
  {
    [forksRequest.toString()]() {
      return 'requested';
    },
    [forksFailure.toString()]() {
      return 'failed';
    },
    [forksSuccess.toString()]() {
      return 'successed';
    },
  },
  'none'
);

const forks = handleActions(
  {
    [forksSuccess.toString()]() {
      return 'successed';
    },
  },
  {}
);

const errorMessage = handleActions(
  {
    [forksFailure.toString()](state: string, { payload: message }): string {
      console.log(message);
      return message;
    },
    [closeErrorMessage.toString()](state: string): string {
      return '';
    },
  },
  ''
);

export default combineReducers({
  forks,
  forksFetchingState,
  errorMessage,
});
