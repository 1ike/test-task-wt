import * as React from 'react';
import { connect } from 'react-redux';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { validate } from 'validate.js';

import { Theme, withStyles } from '@material-ui/core/styles';

import {
  Button,
  CircularProgress,
  Fade,
  TextField,
  WithStyles
} from '@material-ui/core';

import { closeErrorMessage, fetchForks } from '../ducks/forks';
import { IReduxState, inBrowser } from '../services/store';
import { RequestState } from '../constants';

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

export const formName = 'repoName';
const inputName = 'repository';
interface IValues {
  [inputName]: string;
}

/**
 * From Github: Username may only contain alphanumeric characters or single hyphens,
 * and cannot begin or end with a hyphen
 */

const validateRepo = (values: IValues) => {
  const constraints = {
    [inputName]: {
      presence: true,
      format: {
        pattern: '^([a-z0-9]([a-z0-9]|-(?!-))*[a-z0-9]|[a-z0-9])/[a-z0-9-_]+$',
        flags: 'i',
        message: 'invalid repo name (must be like owner/repositoryName)',
      },
    },
  };

  return validate(values, constraints);
};

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
    autoFocus={true}
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

interface IProps
  extends WithStyles<typeof styles>,
    RouteComponentProps,
    InjectedFormProps<IValues> {
  fetchForks: typeof fetchForks;
  closeErrorMessage: typeof closeErrorMessage;
  forksFetchingState: RequestState;
}

class Form extends React.Component<IProps> {
  public render() {
    const { classes, handleSubmit, forksFetchingState } = this.props;
    const loading = forksFetchingState === RequestState.Requested;

    return (
      <form className={classes.root} onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          name={inputName}
          component={renderTextField}
          label={inputName}
          placeholder='owner/repositoryName'
          className={classes.input}
          normalize={this.trim}
        />
        <Button
          type='submit'
          disabled={loading || !inBrowser}
          className={classes.button}
        >
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
      </form>
    );
  }

  private onSubmit = (values: IValues) => {
    this.props.fetchForks({
      repoName: values[inputName],
      history: this.props.history,
    });
  }

  private trim = (value: string) => value.trim();
}

const mapStateToProps = (state: IReduxState) => ({
  appName: state.appName,
  forksFetchingState: state.forks.fetchingState,
});

export default connect(
  mapStateToProps,
  { fetchForks, closeErrorMessage }
)(
  withStyles(styles)(
    reduxForm({ form: formName, validate: validateRepo })(withRouter(Form))
  )
);
