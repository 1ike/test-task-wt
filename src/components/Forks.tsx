import * as React from 'react';
import { connect } from 'react-redux';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  WithStyles
} from '@material-ui/core';

import { Forks } from '../ducks/forks';
import { IReduxState } from '../redux/configureStore';
import HelmetWithFeathers from './HelmetWithFeathers';

function ForksTable(props: { rows: Forks }) {
  // const { classes } = props;

  return (
    <Paper
    // className={classes.root}
    >
      <Table
      // className={classes.table}
      >
        <TableHead>
          <TableRow>
            <TableCell>Full name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Stars</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell component='th' scope='row'>
                <a href={row.html_url}>{row.full_name}</a>
              </TableCell>
              <TableCell>
                <a href={row.owner.html_url}>{row.owner.login}</a>
              </TableCell>
              <TableCell>
                <a href={`${row.html_url}/stargazers`}>
                  {row.stargazers_count}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export interface IHelloProps {
  forks: { items: Forks };
}

const Hello = (props: IHelloProps) => (
  <React.Fragment>
    <HelmetWithFeathers title='Forks' />
    <h1>Hello!</h1>
    <ForksTable rows={props.forks.items} />
  </React.Fragment>
);

const mapStateToProps = (state: IReduxState) => ({
  forks: state.forks,
});

export default connect(mapStateToProps)(Hello);
