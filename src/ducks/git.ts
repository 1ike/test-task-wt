import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import { reducer as form } from 'redux-form';
import { call, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';

// import counterReducer from './reducers/counterReducer';

/**
 * ACTION CREATORS
 */

export const forksRequest = createAction('FORKS_REQUEST');
export const forksSuccess = createAction('FORKS_SUCCESS');
export const forksFailure = createAction('FORKS_FAILURE');

export const fetchForks = () => {
  return { type: 'FETCHED_FORKS' };
};

/**
 * SAGAS
 */

export function* watchFetchForks() {
  yield takeEvery('FETCHED_FORKS', fetchForksAsync);
}

export function* fetchForksAsync() {
  try {
    yield put(forksRequest());
    const data = yield call(() => {
      return fetch('https://dogs.ceo/api/breeds/image/random').then((res) =>
        res.json(),
      );
    });
    yield put(forksSuccess(data));
  } catch (error) {
    yield put(forksFailure());
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
  'none',
);

const forks = handleActions(
  {
    [forksSuccess.toString()]() {
      return 'successed';
    },
  },
  {},
);

const errorMessage = handleActions(
  {
    [forksFailure.toString()](state: string, { payload: message }): string {
      return message;
    },
    // [actions.setCurrentChannel](state) {
    //   return state;
    // },
  },
  '',
);

export default combineReducers({
  form,
  forks,
  forksFetchingState,
  errorMessage,
});
