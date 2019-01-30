import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  WithStyles
} from '@material-ui/core';

import { IReduxState } from '../store/configureStore';
import Menu from './Menu';

interface IProps {
  appName: string;
}

const styles = {
  flex: {
    flex: 1,
  },
};

interface IProps extends WithStyles<typeof styles> {}

function ButtonAppBar(props: IProps) {
  const { classes, appName } = props;
  return (
    <AppBar position='static'>
      <Toolbar>
        <Menu />
        <Typography variant='h6' color='inherit' className={classes.flex}>
          {appName}
        </Typography>
        {/* <Button color='inherit'>Login</Button> */}
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = (state: IReduxState) => ({
  appName: state.appName,
});

const Header = connect(mapStateToProps)(withStyles(styles)(ButtonAppBar));

const Layout = (props: any) => {
  return (
    <React.Fragment>
      <Header />
      {props.children}
    </React.Fragment>
  );
};

export default Layout;
