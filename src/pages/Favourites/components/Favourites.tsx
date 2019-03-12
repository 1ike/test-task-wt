import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';

import {
  Favourites as FavouritesType,
  manageFavourite,
  IFavouritePayload
} from '../../../ducks/favourites';
import { User } from '../../../ducks/user';
import { isSigned } from '../../../services/helpers';
import { IReduxState } from '../../../services/store';
import { IRepo, RequestState } from '../../../constants';
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

export interface IFavouritesProps
  extends WithStyles<typeof styles>,
    RouteComponentProps {
  page: number;
  perPage: number;
  favourites: FavouritesType;
  favouritesFetchingState: RequestState;
  favouriteManagingState: RequestState;
  user: User;
  manageFavourite(payload: IFavouritePayload): void;
}

const Favourites = (props: IFavouritesProps) => {
  const {
    classes: { root: rootClass, title: titleCLass },
    page,
    perPage,
    favourites,
    favouritesFetchingState,
    favouriteManagingState,
    manageFavourite: handleManageFavourite,
    user,
  } = props;

  const title = 'Favourite Forks';

  const isFavouritesLoaded = favouritesFetchingState === RequestState.Successed;

  const isFavouritesRequested =
    favouritesFetchingState === RequestState.Requested;

  const FavouritesTitle = (titleProps: { title: string }) => (
    <Title classes={{ root: titleCLass }}>{titleProps.title}</Title>
  );

  return (
    <main className={rootClass}>
      <HelmetWithFeathers title={title} />
      {!isSigned(user) ? (
        <FavouritesTitle title='You need to login for using Favourites feature' />
      ) : isFavouritesLoaded && favourites.length === 0 ? (
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
  user: state.user.item,
});

export default connect(
  mapStateToProps,
  { manageFavourite }
)(withStyles(styles)(Favourites));
