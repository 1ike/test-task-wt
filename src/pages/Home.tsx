import * as React from 'react';

import { Theme, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import HelmetWithFeathers from '../components/HelmetWithFeathers';
import Title from '../components/Title';
import Form from '../components/Form';

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as 'column',
  },
});

const Home = (props: WithStyles<typeof styles>) => (
  <main className={props.classes.root}>
    <HelmetWithFeathers title='Home' />
    <Title>Find github repository forks</Title>
    <Form />
  </main>
);

export default withStyles(styles)(Home);
