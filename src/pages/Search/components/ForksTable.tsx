import * as React from 'react';
import { connect } from 'react-redux';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';

import { Forks as ForksType } from '../../../ducks/forks';
import { IReduxState } from '../../../store/configureStore';
import TablePaginationActions from './TablePaginationActions';

function ForksTable(props: { rows: ForksType }) {
  const { rows } = props;
  const rowsPerPage = 10;
  const page = 2;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ): void => {
    // this.setState({ page: newPage });
  };

  return (
    <Paper>
      <Table>
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
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                native: false,
              }}
              onChangePage={handleChangePage}
              // onChangeRowsPerPage={this.handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}

const mapStateToProps = (state: IReduxState) => ({
  forks: state.forks,
});

export default connect(mapStateToProps)(ForksTable);
