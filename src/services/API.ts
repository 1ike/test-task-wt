import axios from 'axios';

import { IFavourite, ManageAction } from '../ducks/favourites';
import { IUser } from '../ducks/user';
import { auth } from '../services/firebase';

import repo from '../../__tests__/__fixtures__/repository';
import forks from '../../__tests__/__fixtures__/forks';
import favourites from '../../__tests__/__fixtures__/favourites';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com/repos/',
  headers: { Accept: 'application/vnd.github.v3.raw+json' },
});

// const fetchRepo = async (repoName: string) => {
//   return githubAPI(repoName);
// };

// const fetchForks = async (repoName: string, page: number, perPage: number) => {
//   return githubAPI(`${repoName}/forks`, {
//     params: { page: page.toString(), per_page: perPage.toString() },
//   });
// };

// const fetchFavourites = async () => {};

// const addFavourite = async (favourite: IFavourite) => {};

// const deleteFavourite = async (favourite: IFavourite) => {};

// const fetchUser = async () => {
//   return auth.signInAnonymously().then((data: { user: IUser }) => data.user);
// };

/**
 * Fakes
 */

const fetchRepoFake = async (repoName: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(repo);
    }, 0);
  });
};

const fetchForksFake = async (
  repoName: string,
  page: number,
  perPage: number
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve({ data: [] });
      resolve(forks);
    }, 0);
  });
};

const fetchFavouritesFake = async () => {
  const fakeData = favourites.data.map((fork: any) => ({
    fork,
    source: repo.data,
  }));

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeData);
    }, 5000);
  });
};

const addFavouriteFake = async (favourite: IFavourite) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(favourite);
    }, 2000);
  });
};

const deleteFavouriteFake = async (favourite: IFavourite) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(favourite);
    }, 2000);
  });
};

const fetchUserFake = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ uid: 'nZrLV3wwOJcMaIWUIqJCIfBGMjx2' });
    }, 500);
  });
};

export default {
  // fetchRepo,
  // fetchForks,
  // fetchFavourites,
  // addFavourite,
  // deleteFavourite,
  // fetchUser,

  fetchRepo: fetchRepoFake,
  fetchForks: fetchForksFake,
  fetchFavourites: fetchFavouritesFake,
  addFavourite: addFavouriteFake,
  deleteFavourite: deleteFavouriteFake,
  fetchUser: fetchUserFake,
};
