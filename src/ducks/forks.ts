import { combineReducers } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../API';

type FetchingState = string;
type ErrorMessage = string;
interface IFork {
  id: number;
  node_id: string;
  full_name: string;
}
type Forks = IFork[];

export interface IForksState {
  items: Forks;
  fetchingState: FetchingState;
  errorMessage: ErrorMessage;
}

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

const fetchingState = handleActions(
  {
    [forksRequest.toString()](): FetchingState {
      return 'requested';
    },
    [forksFailure.toString()](): FetchingState {
      return 'failed';
    },
    [forksSuccess.toString()](): FetchingState {
      return 'successed';
    },
  },
  'none'
);

const items = handleActions(
  {
    [forksSuccess.toString()](state: Forks, { payload: forks }): Forks {
      return forks;
    },
  },
  []
);

const errorMessage = handleActions(
  {
    [forksFailure.toString()](
      state: ErrorMessage,
      { payload: message }
    ): ErrorMessage {
      return message;
    },
    [closeErrorMessage.toString()](state: string): ErrorMessage {
      return '';
    },
  },
  ''
);

export default combineReducers({
  items,
  fetchingState,
  errorMessage,
});
