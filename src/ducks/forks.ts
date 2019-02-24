import { combineReducers } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../services/API';
import history from '../services/history';
import { createRelativePath } from '../services/helpers';

/**
 * INTERFACES / TYPE
 */

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
  page: number;
  perPage: number;
  fetchingState: FetchingState;
  errorMessage: ErrorMessage;
}

/**
 * CONSTANTS
 */

export const FORKS_PAGE = 1;
export const FORKS_PER_PAGE = 10;

export enum FetchingState {
  Requested = 'requested',
  Failed = 'failed',
  Successed = 'successed',
  None = 'none',
}

export const FORKS_REQUEST = 'FORKS_REQUEST';
export const FORKS_SUCCESS = 'FORKS_SUCCESS';
export const FORKS_FAILURE = 'FORKS_FAILURE';

export const CLOSE_ERROR_MESSAGE = 'CLOSE_ERROR_MESSAGE';

export const FETCHED_FORKS = 'FETCHED_FORKS';

/**
 * ACTION CREATORS
 */

export const forksRequest = createAction(FORKS_REQUEST);
export const forksSuccess = createAction(FORKS_SUCCESS);
export const forksFailure = createAction(FORKS_FAILURE);

export const closeErrorMessage = createAction(CLOSE_ERROR_MESSAGE);

export const fetchForks = createAction(FETCHED_FORKS);

/*
 * SAGAS
 */

export function* watchFetchForks() {
  yield takeEvery(FETCHED_FORKS, fetchForksAsync);
}

const redirectTo = (path: string) => {
  history.push(path);
};
export function* fetchForksAsync({
  payload: { repository: repoName, page = FORKS_PAGE, perPage = FORKS_PER_PAGE },
}: Action<{
  repository: string;
  page: number;
  perPage: number;
}>) {
  try {
    yield put(forksRequest());
    const repoResponse = yield call(API.fetchRepo, repoName);
    console.log(repoResponse);
    const forksResponse = yield call(API.fetchForks, repoName, page, perPage);
    console.log(forksResponse);
    yield put(
      forksSuccess({
        repo: repoResponse.data,
        forks: forksResponse.data,
        page,
        perPage,
      })
    );
    yield call(redirectTo, createRelativePath(repoName, page, perPage));
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
    [forksRequest.toString()]() {
      return FetchingState.Requested;
    },
    [forksFailure.toString()](): FetchingState {
      return FetchingState.Failed;
    },
    [forksSuccess.toString()](): FetchingState {
      return FetchingState.Successed;
    },
  },
  FetchingState.None
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

const forksPage = handleActions(
  {
    [forksSuccess.toString()](
      state,
      { payload: { page } }: Action<{ page: number }>
    ) {
      return page || state;
    },
  },
  FORKS_PAGE
);

const forksPerPage = handleActions(
  {
    [forksSuccess.toString()](
      state,
      { payload: { perPage } }: Action<{ perPage: number }>
    ) {
      return perPage || state;
    },
  },
  FORKS_PER_PAGE
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
  page: forksPage,
  perPage: forksPerPage,
  fetchingState,
  errorMessage,
});
