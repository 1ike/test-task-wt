import * as React from 'react';
import { connect } from 'react-redux';
import { Action, ActionFunction1 } from 'redux-actions';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Tooltip,
  WithStyles
} from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

import ErrorSnackbar from '../components/ErrorSnackbar';
import { IReduxState } from '../services/store';
import { isSigned } from '../services/utils';
import Menu from './Menu';
import { RequestState, RouteName } from '../constants';
import { fetchUser, logoutUser, User } from '../ducks/user';

interface IProps {
  appName: string;
  user: User;
  userfetchingState: RequestState;
  userLogoutState: RequestState;
  fetchUser: ActionFunction1<void, Action<void>>;
  logoutUser: ActionFunction1<void, Action<void>>;
}

const styles = {
  root: {
    marginBottom: 50,
  },
  flex: {
    flex: 1,
  },
  logoLink: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover, &:active, &:focus': {
      textDecoration: 'underline',
    },
  },
};

interface IPropsWithStyles extends IProps, WithStyles<typeof styles> {}

function ButtonAppBar(props: IPropsWithStyles) {
  const {
    classes,
    appName,
    user,
    userfetchingState,
    userLogoutState,
    fetchUser: logIn,
    logoutUser: logOut,
  } = props;

  const isRequested =
    userfetchingState === RequestState.Requested ||
    userLogoutState === RequestState.Requested;

  interface IButtonProps {
    text: string;
    callback: ActionFunction1<void, Action<void>>;
    title?: string;
  }
  const UserButton = (buttonProps: IButtonProps) => {
    const onClick = () => {
      buttonProps.callback();
    };

    const Btn = (tooltipProps: ButtonProps) => (
      <Button
        size='small'
        variant='contained'
        color='inherit'
        disabled={isRequested}
        onClick={onClick}
        {...tooltipProps}
      >
        {buttonProps.text}
      </Button>
    );

    return buttonProps.title && !isRequested ? (
      <Tooltip title={buttonProps.title} placement='left'>
        <Btn />
      </Tooltip>
    ) : (
      <Btn />
    );
  };

  return (
    <AppBar position='static' className={classes.root}>
      <Toolbar>
        <Menu />
        <Typography variant='h6' color='inherit' className={classes.flex}>
          <Link to={RouteName.Home} className={classes.logoLink}>
            {appName}
          </Link>
        </Typography>
        {isSigned(user) ? (
          <UserButton
            text='Logout (forever)'
            aria-label='Logout'
            callback={logOut}
            title={'Caution: after logout you\'ll loose your Favourites'}
          />
        ) : (
          <UserButton
            text='Login anonymously'
            aria-label='Login'
            callback={logIn}
            title='Login for use Favourites feature'
          />
        )}
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = (state: IReduxState) => ({
  appName: state.appName,
  user: state.user.item,
  userfetchingState: state.user.fetchingState,
  userLogoutState: state.user.logoutState,
});

const Header = connect(
  mapStateToProps,
  { fetchUser, logoutUser }
)(withStyles(styles)(ButtonAppBar));

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Header />
      {props.children}
      <ErrorSnackbar />
    </React.Fragment>
  );
};

export default Layout;
