import { combineReducers } from 'redux';
import { Action, createAction, handleActions } from 'redux-actions';

import { call, put, takeEvery } from 'redux-saga/effects';

import API from '../services/API/forksAPI';
import { RequestState, IRepo } from '../constants';
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
}
export interface IForksFetchPayload {
  repoName: string;
  page?: number;
  perPage?: number;
  history: {
    push: (path: string) => void;
  };
}
export interface IForksSuccessPayload {
  repository: IRepo;
  forks: Forks;
  page: number;
  perPage: number;
}
export interface IForksResponse {
  repository: IRepo;
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

export const forksRequest = createAction<void>(FORKS_REQUEST);
export const forksSuccess = createAction<IForksSuccessPayload>(FORKS_SUCCESS);
export const forksFailure = createAction<void>(FORKS_FAILURE);

export const closeErrorMessage = createAction<void>(CLOSE_ERROR_MESSAGE);

export const fetchForks = createAction<IForksFetchPayload>(FETCH_FORKS);

/*
 * SAGAS
 */

export function* watchFetchForks() {
  yield takeEvery(FETCH_FORKS, fetchForksAsync);
}

export function* fetchForksAsync({
  payload: { repoName, page = FORKS_PAGE, perPage = FORKS_PER_PAGE, history },
}: Action<IForksFetchPayload>) {
  try {
    yield put(forksRequest());
    const { repository, forks, correctedPage }: IForksResponse = yield call(
      API.fetchForksGQL,
      repoName,
      page,
      perPage
    );
    yield put(
      forksSuccess({
        repository,
        forks,
        page: correctedPage,
        perPage,
      })
    );
    yield call(
      history.push,
      createRelativePath(repoName, correctedPage, perPage)
    );
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

const repo = handleActions(
  {
    [forksSuccess.toString()](
      state,
      { payload: { repository } }: Action<IForksSuccessPayload>
    ): IRepo {
      return repository;
    },
  },
  {}
);

const items = handleActions(
  {
    [forksSuccess.toString()](
      state,
      { payload: { forks } }: Action<IForksSuccessPayload>
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
      { payload: { page } }: Action<IForksSuccessPayload>
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
      { payload: { perPage } }: Action<IForksSuccessPayload>
    ) {
      return perPage || state;
    },
  },
  FORKS_PER_PAGE
);

export default combineReducers({
  repository: repo,
  items,
  page: forksPage,
  perPage: forksPerPage,
  fetchingState,
});
