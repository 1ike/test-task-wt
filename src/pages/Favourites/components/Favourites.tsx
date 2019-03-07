import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';

import {
  Favourites,
  manageFavourite,
  IFavouritePayload
} from '../../../ducks/favourites';
import { IRepo, FetchingState } from '../../../constants';
import { IReduxState } from '../../../services/store';
import HelmetWithFeathers from '../../../components/HelmetWithFeathers';
import Title from '../../../components/Title';
import FavouritesTable from './FavouritesTable';

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
    marginTop: '3em',
    marginBottom: '4em',
    color: 'red',
  },
  title: {
    marginBottom: '1em',
  },
  subtitle: {
    marginBottom: '1em',
  },
});

export interface ISearchProps
  extends WithStyles<typeof styles>,
    RouteComponentProps {
  page: number;
  perPage: number;
  favourites: Favourites;
  favouritesFetchingState: FetchingState;
  favouriteManagingState: FetchingState;
  manageFavourite(payload: IFavouritePayload): void;
}

const Search = (props: ISearchProps) => {
  const {
    classes: {
      root: rootClass,

      title: titleCLass,
    },
    page,
    perPage,
    favourites,
    favouritesFetchingState,
    favouriteManagingState,
    manageFavourite: handleManageFavourite,
  } = props;

  const title = 'Favourite Forks';

  const isFavouritesLoaded =
    favouritesFetchingState === FetchingState.Successed;

  const isFavouritesRequested =
    favouritesFetchingState === FetchingState.Requested;

  const FavouritesTitle = (titleProps: { title: string }) => (
    <Title classes={{ root: titleCLass }}>{titleProps.title}</Title>
  );

  return (
    <main className={rootClass}>
      <HelmetWithFeathers title={title} />
      {isFavouritesLoaded && favourites.length === 0 ? (
        <FavouritesTitle title='You have no favourites yet' />
      ) : (
        <React.Fragment>
          <FavouritesTitle title={title} />
          {isFavouritesRequested ? (
            <CircularProgress />
          ) : (
            <FavouritesTable
              rows={favourites}
              page={page}
              perPage={perPage}
              count={favourites.length}
              manageFavourite={handleManageFavourite}
              favouriteManagingState={favouriteManagingState}
            />
          )}
        </React.Fragment>
      )}
    </main>
  );
};

const mapStateToProps = (state: IReduxState) => ({
  page: state.forks.page,
  perPage: state.forks.perPage,
  favourites: state.favourites.items,
  favouritesFetchingState: state.favourites.fetchingState,
  favouriteManagingState: state.favourites.managingState,
});

export default connect(
  mapStateToProps,
  { manageFavourite }
)(withStyles(styles)(Search));
