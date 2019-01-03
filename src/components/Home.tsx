import * as React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';

import { validate } from 'validate.js';

import { withStyles } from '@material-ui/core/styles';

import {
  Button,
  CircularProgress,
  Fade,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
  WithStyles,
} from '@material-ui/core';

import HelmetWithFeathers from './HelmetWithFeathers';

import { IReduxState } from '../redux/configureStore';

const styles = {
  main: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as 'column',
  },
  form: {
    display: 'flex',
    // flexGrow: 1,
  },
  title: {
    fontSize: 36,
    marginBottom: '5%',
  },
  button: {
    marginLeft: 20,
  },
};

interface IProps extends WithStyles<typeof styles> {}

class Home extends React.Component<IProps & InjectedFormProps> {
  public render() {
    const { classes, handleSubmit, reset } = this.props;

    return (
      <main className={classes.main}>
        <HelmetWithFeathers title='Home' />
        <Typography variant='h1' color='inherit' className={classes.title}>
          Find github repository forks
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
          <FormControl
            // className={classes.formControl}
            error={true}
            aria-describedby='repo-input'
          >
            <InputLabel htmlFor='repo-input'>repository </InputLabel>
            <Input
              id='repo-input'
              placeholder='owner/repositoryName'
              // value={this.state.name}
              // onChange={this.handleChange}
            />
            <FormHelperText id='repo-input-text'>
              Type repo name (for example: like/repositoryName)
            </FormHelperText>
            <div
            // className={classes.placeholder}
            >
              <Fade
                // in={loading}
                // style={{
                //   transitionDelay: loading ? '800ms' : '0ms',
                // }}
                unmountOnExit={true}
              >
                <CircularProgress />
              </Fade>
            </div>
          </FormControl>
          <Button
            type='submit'
            // onClick={this.handleClickLoading}
            className={classes.button}
          >
            Find forks
          </Button>
        </form>
      </main>
    );
  }

  private onSubmit = (value: any) => {
    // console.log(value);
  }

  private validate = (repo: string) => {
    const constraints = {
      username: {
        format: {
          pattern: '^[a-z0-9]([a-z0-9]|-(?!-))+[a-z0-9]/[a-z0-9-_]+',
          flags: 'i',
          message: 'invalid repo name',
        },
      },
    };

    return validate({ repo }, constraints);
  }
}

const mapStateToProps = (state: IReduxState) => ({
  appName: state.appName,
});

export default connect(mapStateToProps)(
  reduxForm({ form: 'repoName' })(withStyles(styles)(Home)),
);
