import axios from 'axios';

import { IFavourite, Favourites, ManageAction } from '../ducks/favourites';
import { IUser, User } from '../ducks/user';
import { db, auth } from '../services/firebase';

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

const fetchFavourites = async (user: IUser): Promise<Favourites> => {
  return db
    .ref(user.uid)
    .once('value')
    .then((snapshot) => {
      console.log(snapshot.val());
      const data = snapshot.val();
      return data ? Object.keys(data).map((key) => data[key]) : [];
    });
};

const manageFavourite = async (
  favourite: IFavourite,
  manageAction: ManageAction,
  user: IUser
): Promise<IFavourite> => {
  return db
    .ref(user.uid)
    .update({
      [favourite.fork.id]: manageAction === ManageAction.Add ? favourite : null,
    })
    .then(() => favourite);
};

const addFavourite = async (
  favourite: IFavourite,
  user: IUser
): Promise<IFavourite> => {
  return db
    .ref(user.uid)
    .update({ [favourite.fork.id]: null })
    .then(() => favourite);
};

const deleteFavourite = async (favourite: IFavourite, user: IUser) => {
  return db
    .ref(user.uid)
    .once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      console.log(data);
      return favourite;
    });
};

const fetchUser = async () => {
  return auth.signInAnonymously().then((data: { user: IUser }) => data.user);
};

const logoutUser = async () => {
  return auth.signOut();
};

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
  const fakeData: Favourites = favourites.data.map((fork) => ({
    fork,
    source: repo.data,
  }));

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeData);
    }, 5000);
  });
};

const manageFavouriteFake = async (
  favourite: IFavourite,
  manageAction: ManageAction,
  user: IUser
) => {
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
    }, 1500);
  });
};

const logoutUserFake = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });
};

export default {
  // fetchRepo,
  // fetchForks,
  fetchFavourites,
  manageFavourite,
  // addFavourite,
  // deleteFavourite,
  fetchUser,
  logoutUser,

  fetchRepo: fetchRepoFake,
  fetchForks: fetchForksFake,
  // fetchFavourites: fetchFavouritesFake,
  // manageFavourite: manageFavouriteFake,
  // addFavourite: addFavouriteFake,
  // deleteFavourite: deleteFavouriteFake,
  // fetchUser: fetchUserFake,
  // logoutUser: logoutUserFake,
};
