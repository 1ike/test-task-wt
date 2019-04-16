import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

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

import {
  Favorite as FavouriteIcon,
  FavoriteBorder as NonFavouriteIcon
} from '@material-ui/icons';

import { Forks, IForksFetchPayload } from '../../../ducks/forks';
import {
  Favourites,
  IFavouritePayload,
  ManageAction
} from '../../../ducks/favourites';
import { User } from '../../../ducks/user';
import { isSigned } from '../../../services/utils';
import { IRepo, RequestState } from '../../../constants';
import TablePaginationActions from '../../../components/TablePaginationActions';

function Transition(props: SlideProps) {
  return <Slide direction='up' {...props} />;
}

interface IProps extends RouteComponentProps {
  rows: Forks;
  page: number;
  perPage: number;
  count: number;
  repository: IRepo;
  favourites: Favourites;
  favouritesFetchingState: RequestState;
  favouriteManagingState: RequestState;
  user: User;
  fetchForks(payload: IForksFetchPayload): void;
  manageFavourite(payload: IFavouritePayload): void;
}

function ForksTable(props: IProps) {
  const {
    rows,
    page,
    perPage,
    count,
    repository,
    favourites,
    favouritesFetchingState,
    manageFavourite,
    favouriteManagingState,
    fetchForks,
    user,
    history,
  } = props;
  const { full_name: repoName } = repository;

  const [open, setOpen] = React.useState(false);
  const [fork, setFork] = React.useState(rows[0] || repository);
  const [isForkInFavourites, setInFavourites] = React.useState(false);

  const yesRef = React.useRef(null);
  const noRef = React.useRef(null);

  const checkInFavourites = (id: number): boolean => {
    return favourites.filter((item) => item.fork.id === id).length > 0;
  };

  const isFavouritesLoaded = favouritesFetchingState === RequestState.Successed;

  const isFavouriteRequested =
    favouriteManagingState === RequestState.Requested;

  const isSignedUser = isSigned(user);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ): void => {
    fetchForks({
      repository: repoName,
      page: newPage,
      perPage,
      history,
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent): void => {
    fetchForks({
      repository: repoName,
      page: 1,
      perPage: +(event.target as HTMLInputElement).value,
      history,
    });
  };

  const openModalFavourites = (
    row: IRepo,
    inFavourites: boolean
  ) => (): void => {
    setFork(row);
    setInFavourites(inFavourites);
    setOpen(true);
  };
  const onEnteredModalFavourites = (): void => {
    yesRef.current.focus();
  };
  const closeModalFavourites = (): void => {
    setOpen(false);
  };

  const handleFavourite = (): void => {
    manageFavourite({
      favourite: { fork, source: repository },
      manageAction: isForkInFavourites ? ManageAction.Delete : ManageAction.Add,
    });
    closeModalFavourites();
  };

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Stars</TableCell>
            {isSignedUser ? <TableCell>Favourites</TableCell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: IRepo) => {
            const inFavourites = checkInFavourites(row.id);
            return (
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
                {isSignedUser ? (
                  <TableCell>
                    <IconButton
                      aria-label={
                        inFavourites
                          ? 'Delete from favourites'
                          : 'Add to favourites'
                      }
                      style={isFavouritesLoaded ? { color: '#ff8866' } : {}}
                      aria-haspopup='true'
                      onClick={openModalFavourites(row, inFavourites)}
                    >
                      {!isFavouritesLoaded ? (
                        '?'
                      ) : isFavouriteRequested && row.id === fork.id ? (
                        <CircularProgress size={20} />
                      ) : inFavourites ? (
                        <FavouriteIcon />
                      ) : (
                        <NonFavouriteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={closeModalFavourites}
        onEntered={onEnteredModalFavourites}
        aria-labelledby='alert-dialog-slide-title'
      >
        <DialogTitle id='alert-dialog-slide-title'>
          {isForkInFavourites
            ? `Delete "${fork.full_name}" from Favourites?`
            : `Add "${fork.full_name}" to Favourites?`}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={closeModalFavourites}
            buttonRef={noRef}
            variant='outlined'
          >
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

export default withRouter(ForksTable);
