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

import { Forks as ForksType, IRepo, fetchForks } from '../../../ducks/forks';
import { IReduxState } from '../../../store/configureStore';
import TablePaginationActions from './TablePaginationActions';

function ForksTable(props: {
  rows: ForksType;
  page: number;
  perPage: number;
  count: number;
  repoName: string;
  fetchForks: typeof fetchForks;
}) {
  const { rows, page, perPage, count, repoName: repository } = props;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ): void => {
    props.fetchForks({ repository, page: newPage, perPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent): void => {
    props.fetchForks({
      repository,
      page: 1,
      perPage: (event.target as HTMLInputElement).value,
    });
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
          {rows.map((row: any) => (
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
              count={count}
              rowsPerPage={perPage}
              page={page - 1}
              SelectProps={{
                native: false,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
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

export default connect(
  mapStateToProps,
  { fetchForks }
)(ForksTable);
