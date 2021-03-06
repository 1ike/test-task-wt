import { Action, createAction, handleActions } from 'redux-actions';

/**
 * INTERFACES / TYPE
 */

export type ErrorMessage = string;

/**
 * CONSTANTS
 */

export const ADD_ERROR = 'ADD_ERROR';
export const DELETE_ERROR = 'DELETE_ERROR';

/**
 * ACTION CREATORS
 */

export const addError = createAction<ErrorMessage>(ADD_ERROR);
export const deleteError = createAction<void>(DELETE_ERROR);

/**
 * REDUCERS
 */

export default handleActions(
  {
    [addError.toString()](
      state,
      { payload: message }: Action<ErrorMessage>
    ): ErrorMessage[] {
      return [...state, message];
    },
    [deleteError.toString()](state): ErrorMessage[] {
      return state.filter((val, idx) => idx !== 0);
    },
  },
  []
);
