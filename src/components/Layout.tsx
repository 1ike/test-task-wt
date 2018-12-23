import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Menu from './Menu';

export interface IHelloProps {
  compiler: string;
  framework: string;
}

const styles = {
  flex: {
    flex: 1,
  },
};

function ButtonAppBar(props: any) {
  const { classes } = props;
  return (
    <AppBar position='static'>
      <Toolbar>
        <Menu />
        <Typography variant='h6' color='inherit' className={classes.flex}>
          Title
        </Typography>
        <Button color='inherit'>Login</Button>
      </Toolbar>
    </AppBar>
  );
}

const Header = withStyles(styles)(ButtonAppBar);

const Layout = (props: any) => {
  return (
    <React.Fragment>
      <Header />
      {props.children}
    </React.Fragment>
  );
};

export default Layout;
