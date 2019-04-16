import * as React from 'react';
import { connect } from 'react-redux';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';

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
import { validateRepo } from '../services/validate';
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
    value={'piotrwitek/react-redux-typescript-guide'}
    // value={'thlorenz/parse-link-header'}
  />
);
const inputName = 'repository';

interface IProps extends WithStyles<typeof styles>, RouteComponentProps {
  fetchForks: typeof fetchForks;
  closeErrorMessage: typeof closeErrorMessage;
  forksFetchingState: RequestState;
}

class Form extends React.Component<IProps & InjectedFormProps> {
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

  private onSubmit = (values: { [inputName]: string }) => {
    this.props.fetchForks({
      repository: values[inputName],
      history: this.props.history,
    });
  }
}

const mapStateToProps = (state: IReduxState, ownProps: { classes?: any }) => ({
  appName: state.appName,
  forksFetchingState: state.forks.fetchingState,
  // classes: ownProps.classes,
});

export default connect(
  mapStateToProps,
  { fetchForks, closeErrorMessage }
)(
  reduxForm({ form: 'repoName', validate: validateRepo })(
    withStyles(styles)(withRouter(Form))
  )
);
