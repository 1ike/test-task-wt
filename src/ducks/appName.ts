import { Action, createAction, handleActions } from 'redux-actions';

/**
 * INTERFACES / TYPE
 */

/**
 * CONSTANTS
 */

export const CHANGE_APP_NAME = 'CHANGE_APP_NAME';

/**
 * ACTION CREATORS
 */

export const changeAppName = createAction<string>(CHANGE_APP_NAME);

/**
 * REDUCERS
 */

export default handleActions(
  {
    [changeAppName.toString()](
      state,
      { payload: name }: Action<string>
    ): string {
      return name;
    },
  },
  ''
);
