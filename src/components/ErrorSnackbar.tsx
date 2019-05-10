import * as React from 'react';
import { connect } from 'react-redux';
import { Action, ActionFunction1 } from 'redux-actions';

import { Snackbar } from '@material-ui/core';

import { IReduxState } from '../services/store';
import { ErrorMessage, deleteError } from '../ducks/errors';

interface IProps {
  error: ErrorMessage;
  deleteError: ActionFunction1<void, Action<void>>;
}

function ErrorSnackbar(props: IProps) {
  const { error, deleteError: clearError } = props;

  const [open, setOpen] = React.useState(true);

  const handleCloseError = () => {
    if (error) {
      setOpen(false);
    }
  };
  const handleExitedError = () => {
    if (error) {
      clearError();
    }
    setOpen(true);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={!!error && open}
      autoHideDuration={3000}
      onClose={handleCloseError}
      onExited={handleExitedError}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id='message-id'>{error}</span>}
    />
  );
}

const mapStateToProps = (state: IReduxState) => ({
  error: state.errors[0],
});

export default connect(
  mapStateToProps,
  { deleteError }
)(ErrorSnackbar);
