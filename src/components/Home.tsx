import * as React from 'react';
import { RouteProps } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

import HelmetWithFeathers from './HelmetWithFeathers';

const Home = (props: RouteProps) => (
  <React.Fragment>
    <HelmetWithFeathers title='Home' />
    <span>'Hello!'</span>
  </React.Fragment>
);

export default Home;
