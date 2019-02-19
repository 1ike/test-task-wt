import * as React from 'react';
import { connect } from 'react-redux';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { RouteComponentProps } from 'react-router-dom';

import { Theme, withStyles } from '@material-ui/core/styles';

import {
  Button,
  CircularProgress,
  Fade,
  Snackbar,
  TextField,
  WithStyles
} from '@material-ui/core';

import { closeErrorMessage, fetchForks } from '../ducks/forks';
import { IReduxState } from '../store/configureStore';
import { validateRepo } from '../services/validate';
import history from '../services/history';
import { RouteName } from '../constants';

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    [theme.breakpoints.up('sm')]: {
      width: 350,
    },
  },
  button: {
    marginLeft: 20,
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
    },
  },
});

interface IWrappedFieldProps extends WrappedFieldProps {
  name: string;
  label: string;
  placeholder: string;
  className: string;
}

const renderTextField = ({
  input,
  label,
  className,
  placeholder,
  meta: { touched, error },
}: IWrappedFieldProps) => (
  <TextField
    label={label}
    error={error && touched}
    placeholder={placeholder}
    className={className}
    helperText={
      (touched && error) || 'Type repo name (for example: like/repositoryName)'
    }
    {...input}
    // value={'piotrwitek/react-redux-typescript-guide'}
    // value={'thlorenz/parse-link-header'}
  />
);

interface IProps extends WithStyles<typeof styles>, RouteComponentProps {
  fetchForks: typeof fetchForks;
  closeErrorMessage: typeof closeErrorMessage;
  forksFetchingState: string;
  message: string;
}

class Form extends React.Component<IProps & InjectedFormProps> {
  private inputName = 'repoInput';

  public render() {
    const { classes, handleSubmit, forksFetchingState, message } = this.props;
    const loading = forksFetchingState === 'requested';

    return (
      <form className={classes.root} onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          name={this.inputName}
          component={renderTextField}
          label='repository'
          placeholder='owner/repositoryName'
          className={classes.input}
        />
        <Button type='submit' disabled={loading} className={classes.button}>
          Find forks
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? '800ms' : '0ms',
              position: 'absolute',
            }}
            unmountOnExit={true}
          >
            <CircularProgress />
          </Fade>
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={!!message}
          autoHideDuration={3000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id='message-id'>{message}</span>}
        />
      </form>
    );
  }

  private onSubmit = (values: { repoInput: string }) => {
    console.log('object');
    history.push(`${RouteName.Search}?page=3&repository=${values.repoInput}`);
    // this.props.fetchForks({
    //   repoName: values.repoInput,
    //   reset: this.props.reset,
    // });
  }

  private handleClose = () => {
    this.props.closeErrorMessage();
  }
}

const mapStateToProps = (state: IReduxState, ownProps: { classes?: any }) => ({
  appName: state.appName,
  forksFetchingState: state.forks.fetchingState,
  message: state.forks.errorMessage,
  // classes: ownProps.classes,
});

export default connect(
  mapStateToProps,
  { fetchForks, closeErrorMessage }
)(
  reduxForm({ form: 'repoName', validate: validateRepo })(
    withStyles(styles)(Form)
  )
);
