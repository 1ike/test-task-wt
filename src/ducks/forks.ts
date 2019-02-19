import { combineReducers } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../services/API';
// import history from '../services/history';

/**
 * INTERFACES
 */
type FetchingState = string;
type ErrorMessage = string;
export interface IRepo {
  id: number;
  node_id: string;
  full_name: string;
  html_url: string;
  forks_count: number;
  stargazers_count: number;
  owner: {
    login: string;
    html_url: string;
  };
}
interface IFork {
  id: number;
  node_id: string;
  full_name: string;
}
export type Forks = IFork[];

export interface IForksState {
  repository: IRepo;
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

/* const redirectTo = (path: string) => {
  history.push(path);
}; */
export function* fetchForksAsync({
  payload: { repository: repoName, page },
}: Action<{
  repository: string;
  page?: number;
}>) {
  try {
    yield put(forksRequest());
    const repoResponse = yield call(API.fetchRepo, repoName);
    console.log(repoResponse);
    const forksResponse = yield call(API.fetchForks, repoName, page);
    console.log(forksResponse);
    yield put(
      forksSuccess({
        repo: repoResponse.data,
        forks: forksResponse.data,
      })
    );
    // yield call(redirectTo, '/forks');
    // yield call(reset);
  } catch (error) {
    console.error(error);
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

const repository = handleActions(
  {
    [forksSuccess.toString()](
      state,
      { payload: { repo } }: Action<{ repo: IRepo }>
    ): IRepo {
      return repo;
    },
  },
  {}
);
const items = handleActions(
  {
    [forksSuccess.toString()](
      state,
      { payload: { forks } }: Action<{ forks: Forks }>
    ): Forks {
      return forks;
    },
  },
  []
);

const errorMessage = handleActions(
  {
    [forksFailure.toString()](state, { payload: message }): ErrorMessage {
      return message;
    },
    [closeErrorMessage.toString()](state): ErrorMessage {
      return '';
    },
  },
  ''
);

export default combineReducers({
  repository,
  items,
  fetchingState,
  errorMessage,
});
