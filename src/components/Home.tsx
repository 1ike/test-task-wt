import * as React from 'react';
import Helmet from 'react-helmet';

import { RouteProps } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

import HelmetSFC from './HelmetSFC';

function Home(props: RouteProps) {
  return (
    <React.Fragment>
      <HelmetSFC title='Home' />
      <span>'Hello!'</span>
    </React.Fragment>
  );
}

export default Home;
