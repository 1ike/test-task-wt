import * as React from 'react';

import { Theme, withStyles } from '@material-ui/core/styles';

import { Typography, WithStyles } from '@material-ui/core';

import HelmetWithFeathers from '../components/HelmetWithFeathers';
import Form from '../components/Form';

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as 'column',
  },
  title: {
    fontSize: 36,
    marginBottom: '5%',
  },
});

const Home = (props: WithStyles<typeof styles>) => (
  <main className={props.classes.root}>
    <HelmetWithFeathers title='Home' />
    <Typography variant='h1' color='inherit' className={props.classes.title}>
      Find github repository forks
    </Typography>
    <Form />
  </main>
);

export default withStyles(styles)(Home);
