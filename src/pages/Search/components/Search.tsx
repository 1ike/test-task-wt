import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { Forks, fetchForks, IForksFetchPayload } from '../../../ducks/forks';
import {
  Favourites,
  manageFavourite,
  IFavouritePayload
} from '../../../ducks/favourites';
import { User } from '../../../ducks/user';
import { IReduxState } from '../../../services/store';
import { IRepo, RequestState } from '../../../constants';
import HelmetWithFeathers from '../../../components/HelmetWithFeathers';
import Title from '../../../components/Title';
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
    marginBottom: '4em',
    color: 'red',
  },
  title: {
    marginBottom: '0.5em',
  },
  subtitle: {
    marginBottom: '1em',
  },
});

export interface ISearchProps
  extends WithStyles<typeof styles>,
    RouteComponentProps {
  forks: Forks;
  repository: IRepo;
  page: number;
  perPage: number;
  favourites: Favourites;
  favouritesFetchingState: RequestState;
  favouriteManagingState: RequestState;
  user: User;
  fetchForks(payload: IForksFetchPayload): void;
  manageFavourite(payload: IFavouritePayload): void;
}

const Search = (props: ISearchProps) => {
  const {
    classes: {
      root: rootClass,
      form: formClass,
      title: titleCLass,
      subtitle: subtitleCLass,
    },
    forks,
    page,
    perPage,
    repository,
    favourites,
    favouritesFetchingState,
    favouriteManagingState,
    fetchForks: handleFetchForks,
    manageFavourite: handleManageFavourite,
    user,
  } = props;
  const {
    full_name,
    html_url,
    forks_count,
    stargazers_count,
    owner,
  } = repository;

  return (
    <main className={rootClass}>
      <HelmetWithFeathers title='Search results' />
      {full_name ? (
        <React.Fragment>
          <Form classes={{ root: formClass }} />
          <Title classes={{ root: titleCLass }}>
            Forks for <a href={html_url}>{full_name}</a>
          </Title>
          <Typography variant='subtitle1' classes={{ root: subtitleCLass }}>
            (owner: <a href={owner.html_url}>{owner.login}</a>, forks:{' '}
            <a href={`${html_url}/forks`}>{forks_count}</a>, stars:{' '}
            <a href={`${html_url}/stargazers`}>{stargazers_count}</a>)
          </Typography>
          <ForksTable
            rows={forks}
            page={page}
            perPage={perPage}
            repository={repository}
            count={forks_count}
            favourites={favourites}
            fetchForks={handleFetchForks}
            favouritesFetchingState={favouritesFetchingState}
            manageFavourite={handleManageFavourite}
            favouriteManagingState={favouriteManagingState}
            user={user}
          />
        </React.Fragment>
      ) : (
        <Title classes={{ root: titleCLass }}>
          Refresh page to get updated search results
        </Title>
      )}
    </main>
  );
};

const mapStateToProps = (state: IReduxState) => ({
  forks: state.forks.items,
  repository: state.forks.repository,
  page: state.forks.page,
  perPage: state.forks.perPage,
  favourites: state.favourites.items,
  favouritesFetchingState: state.favourites.fetchingState,
  favouriteManagingState: state.favourites.managingState,
  user: state.user.item,
});

export default connect(
  mapStateToProps,
  { fetchForks, manageFavourite }
)(withStyles(styles)(Search));
