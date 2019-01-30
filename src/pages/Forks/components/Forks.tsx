import * as React from 'react';
import { connect } from 'react-redux';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

import { Forks as ForksType } from '../../../ducks/forks';
import { IReduxState } from '../../../store/configureStore';
import HelmetWithFeathers from '../../../components/HelmetWithFeathers';
import Form from '../../../components/Form';
import ForksTable from './ForksTable';

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as 'column',
    paddingBottom: 50,
  },
  form: {
    marginTop: '5%',
    marginBottom: '5%',
    color: 'red',
  },
  title: {
    fontSize: 36,
    marginBottom: '5%',
  },
});

export interface IForksProps extends WithStyles<typeof styles> {
  forks: { items: ForksType };
}

const Forks = (props: IForksProps) => (
  <main className={props.classes.root}>
    <HelmetWithFeathers title='Forks' />
    <Form classes={{ root: props.classes.form }} />
    <h1>Hello!</h1>
    <ForksTable rows={props.forks.items} />
  </main>
);

const mapStateToProps = (state: IReduxState) => ({
  forks: state.forks,
});

export default connect(mapStateToProps)(withStyles(styles)(Forks));
