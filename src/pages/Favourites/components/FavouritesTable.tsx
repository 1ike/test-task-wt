import * as React from 'react';

import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
  CircularProgress
} from '@material-ui/core';
import { SlideProps } from '@material-ui/core/Slide';

import { Delete as DeleteIcon } from '@material-ui/icons';

import {
  Favourites,
  IFavourite,
  IFavouritePayload,
  ManageAction
} from '../../../ducks/favourites';
import { RequestState } from '../../../constants';

import TablePaginationActions from '../../../components/TablePaginationActions';

function Transition(props: SlideProps) {
  return <Slide direction='up' {...props} />;
}

function ForksTable(props: {
  rows: Favourites;
  page: number;
  perPage: number;
  count: number;
  favouriteManagingState: RequestState;
  manageFavourite(payload: IFavouritePayload): void;
}) {
  const {
    rows,
    page,
    perPage,
    count,
    manageFavourite,
    favouriteManagingState,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [favourite, setFavourite] = React.useState(rows[0]);

  const yesRef = React.useRef(null);
  const noRef = React.useRef(null);

  const isFavouriteRequested =
    favouriteManagingState === RequestState.Requested;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ): void => {
    // fetchForks({ repository: repoName, page: newPage, perPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent): void => {
    // fetchForks({
    //   repository: repoName,
    //   page: 1,
    //   perPage: +(event.target as HTMLInputElement).value,
    // });
  };

  const openModal = (row: IFavourite) => (): void => {
    setFavourite(row);
    setOpen(true);
  };
  const onEnteredModal = (): void => {
    yesRef.current.focus();
  };
  const closeModal = (): void => {
    setOpen(false);
  };

  const handleFavourite = (): void => {
    manageFavourite({
      favourite,
      manageAction: ManageAction.Delete,
    });
    closeModal();
  };

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Stars</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: IFavourite) => {
            const {
              fork: { id, full_name, html_url, owner, stargazers_count },
              source,
            } = row;

            return (
              <TableRow key={id}>
                <TableCell component='th' scope='row'>
                  <a href={html_url}>{full_name}</a>
                </TableCell>
                <TableCell>
                  <a href={owner.html_url}>{owner.login}</a>
                </TableCell>
                <TableCell>
                  <a href={`${html_url}/stargazers`}>{stargazers_count}</a>
                </TableCell>
                <TableCell>
                  <a href={source.html_url}>{source.full_name}</a>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label='Delete'
                    aria-haspopup='true'
                    onClick={openModal(row)}
                  >
                    {isFavouriteRequested && id === favourite.fork.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {/* <TableFooter>
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
        </TableFooter> */}
      </Table>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={closeModal}
        onEntered={onEnteredModal}
        aria-labelledby='alert-dialog-slide-title'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {`Delete "${favourite.fork.full_name}" from Favourites?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={closeModal} buttonRef={noRef} variant='outlined'>
            No
          </Button>
          <Button
            onClick={handleFavourite}
            buttonRef={yesRef}
            variant='outlined'
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ForksTable;
