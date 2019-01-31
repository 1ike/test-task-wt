import * as React from 'react';

import { Theme, withStyles } from '@material-ui/core/styles';
import { Typography, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) => ({
  root: {
    fontSize: 36,
    marginBottom: '1.5em',
  },
});

const Title = (
  props: { children: React.ReactNode } & WithStyles<typeof styles>
) => (
  <Typography variant='h1' color='inherit' className={props.classes.root}>
    {props.children}
  </Typography>
);

export default withStyles(styles)(Title);
