import { combineReducers } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../services/API/forksAPI';
import { RequestState, ErrorMessage, IRepo } from '../constants';
import { createRelativePath, createErrorMessage } from '../services/utils';
import { addError } from './errors';

/**
 * INTERFACES / TYPES
 */

export type Forks = IRepo[];

export interface IForksState {
  repository: IRepo;
  items: Forks;
  page: number;
  perPage: number;
  fetchingState: RequestState;
  errorMessage: ErrorMessage;
}
export interface IForksFetchPayload {
  repository: string;
  page: number;
  perPage: number;
  history: {
    push: (path: string) => void;
  };
}
export interface IForksSuccessPayload {
  repo: IRepo;
  forks: Forks;
  page: number;
  perPage: number;
}
export interface IForksResponse {
  repo: IRepo;
  forks: Forks;
  correctedPage: number;
}

export type IPush = (path: string) => void;

/**
 * CONSTANTS
 */

export const FORKS_PAGE = 1;
export const FORKS_PER_PAGE = 10;

export const FORKS_REQUEST = 'FORKS_REQUEST';
export const FORKS_SUCCESS = 'FORKS_SUCCESS';
export const FORKS_FAILURE = 'FORKS_FAILURE';

export const CLOSE_ERROR_MESSAGE = 'CLOSE_ERROR_MESSAGE';

export const FETCH_FORKS = 'FETCH_FORKS';

/**
 * ACTION CREATORS
 */

export const forksRequest = createAction(FORKS_REQUEST);
export const forksSuccess = createAction<IForksSuccessPayload>(FORKS_SUCCESS);
export const forksFailure = createAction(FORKS_FAILURE);

export const closeErrorMessage = createAction(CLOSE_ERROR_MESSAGE);

export const fetchForks = createAction(FETCH_FORKS);

/*
 * SAGAS
 */

export function* watchFetchForks() {
  yield takeEvery(FETCH_FORKS, fetchForksAsync);
}

export function* fetchForksAsync({
  payload: {
    repository: repoName,
    page = FORKS_PAGE,
    perPage = FORKS_PER_PAGE,
    history,
  },
}: Action<IForksFetchPayload>) {
  try {
    yield put(forksRequest());
    const { repo, forks, correctedPage }: IForksResponse = yield call(
      API.fetchForks,
      repoName,
      page,
      perPage
    );
    console.log(repo);
    console.log(forks);
    yield put(
      forksSuccess({
        repo,
        forks,
        page: correctedPage,
        perPage,
      })
    );
    yield call(history.push, createRelativePath(repoName, page, perPage));
  } catch (error) {
    console.error(error);
    yield put(forksFailure());
    yield put(addError(createErrorMessage('Fetch Forks', error.message)));
  }
}

/**
 * REDUCERS
 */

const fetchingState = handleActions(
  {
    [forksRequest.toString()]() {
      return RequestState.Requested;
    },
    [forksFailure.toString()](): RequestState {
      return RequestState.Failed;
    },
    [forksSuccess.toString()](): RequestState {
      return RequestState.Successed;
    },
  },
  RequestState.None
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
});
