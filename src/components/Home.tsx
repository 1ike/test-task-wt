import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';

import { Theme, withStyles } from '@material-ui/core/styles';

import {
  Button,
  CircularProgress,
  Fade,
  Snackbar,
  TextField,
  Typography,
  WithStyles
} from '@material-ui/core';

import { closeErrorMessage, fetchForks } from '../ducks/forks';
import { IReduxState } from '../redux/configureStore';
import { validateRepo } from '../validate';
import HelmetWithFeathers from './HelmetWithFeathers';

import history from '../history';

const styles = (theme: Theme) => ({
  main: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as 'column',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
  },
  title: {
    fontSize: 36,
    marginBottom: '5%',
  },
  input: {
    width: '90%',
    margin: 'auto',
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
    value={'goemen/react-material-ui-typescript'}
  />
);

interface IProps extends WithStyles<typeof styles> {
  fetchForks: typeof fetchForks;
  closeErrorMessage: typeof closeErrorMessage;
  forksFetchingState: string;
  message: string;
}

class Home extends React.Component<IProps & InjectedFormProps> {
  public state = {
    redirect: false,
  };

  private inputName = 'repoInput';

  public render() {
    const {
      classes,
      handleSubmit,
      forksFetchingState,
      message,
      reset,
    } = this.props;
    const loading = forksFetchingState === 'requested';

    if (forksFetchingState === 'successed' && this.state.redirect) {
      history.push('/forks');
      // return <Redirect to='/forks' />;
    }

    return (
      <main className={classes.main}>
        <HelmetWithFeathers title='Home' />
        <Typography variant='h1' color='inherit' className={classes.title}>
          Find github repository forks
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
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
        </form>
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
      </main>
    );
  }

  private onSubmit = (values: any) => {
    console.log(values);
    this.props.fetchForks({ repoName: values.repoInput });
    this.setState({ redirect: true });
  }

  private handleClose = (values: any) => {
    this.props.closeErrorMessage();
  }
}

const mapStateToProps = (state: IReduxState) => ({
  appName: state.appName,
  forksFetchingState: state.forks.fetchingState,
  message: state.forks.errorMessage,
});

export default connect(
  mapStateToProps,
  { fetchForks, closeErrorMessage }
)(
  reduxForm({ form: 'repoName', validate: validateRepo })(
    withStyles(styles)(Home)
  )
);
