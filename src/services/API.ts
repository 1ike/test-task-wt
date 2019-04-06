import axios, { AxiosPromise, AxiosResponse } from 'axios';

import {
  FORKS_PAGE,
  FORKS_PER_PAGE,
  IRepoResponse,
  IForksResponse
} from '../ducks/forks';
import { IFavourite, Favourites, ManageAction } from '../ducks/favourites';
import { IUser, User } from '../ducks/user';
// import { db, auth } from '../services/firebase';

import repo from '../../__tests__/__fixtures__/repository';
import forks from '../../__tests__/__fixtures__/forks';
import favourites from '../../__tests__/__fixtures__/favourites';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com/repos/',
  headers: { Accept: 'application/vnd.github.v3.raw+json' },
});

const fetchRepo = (repoName: string): AxiosPromise<IRepoResponse> => {
  return githubAPI(repoName);
};

const fetchForks = (
  repoName: string,
  page = FORKS_PAGE,
  perPage = FORKS_PER_PAGE
): AxiosPromise<IForksResponse> => {
  return githubAPI(`${repoName}/forks`, {
    params: { page: page.toString(), per_page: perPage.toString() },
  });
};

// const fetchFavourites = (user: IUser): Promise<Favourites> => {
//   return db
//     .ref(user.uid)
//     .once('value')
//     .then((snapshot) => {
//       console.log(snapshot.val());
//       const data = snapshot.val();
//       return data ? Object.keys(data).map((key) => data[key]) : [];
//     });
// };

// const manageFavourite = (
//   favourite: IFavourite,
//   manageAction: ManageAction,
//   user: IUser
// ): Promise<IFavourite> => {
//   return db
//     .ref(user.uid)
//     .update({
//       [favourite.fork.id]: manageAction === ManageAction.Add ? favourite : null,
//     })
//     .then(() => favourite);
// };

/* const addFavourite = (
  favourite: IFavourite,
  user: IUser
): Promise<IFavourite> => {
  return db
    .ref(user.uid)
    .update({ [favourite.fork.id]: null })
    .then(() => favourite);
};

const deleteFavourite = (favourite: IFavourite, user: IUser) => {
  return db
    .ref(user.uid)
    .once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      console.log(data);
      return favourite;
    });
}; */

// const fetchUser = () => {
//   return auth.signInAnonymously().then((data: { user: IUser }) => data.user);
// };

// const logoutUser = () => {
//   return auth.signOut();
// };

/**
 * Fakes
 */

const fetchRepoFake = (repoName: string): Promise<IRepoResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject({ message: 'fetch repo' });
      resolve(repo);
    }, 0);
  });
};

const fetchForksFake = (
  repoName: string,
  page: number,
  perPage: number
): Promise<IForksResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject({ message: 'fetch Forks' });
      resolve(forks);
    }, 0);
  });
};

const fetchFavouritesFake = () => {
  const fakeData: Favourites = favourites.data.map((fork) => ({
    fork,
    source: repo.data,
  }));

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ message: 'fetch Favourites' });
      resolve(fakeData);
    }, 5000);
  });
};

const manageFavouriteFake = (
  favourite: IFavourite,
  manageAction: ManageAction,
  user: IUser
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ message: 'manage Favourite' });
      resolve(favourite);
    }, 2000);
  });
};

/* const addFavouriteFake = (
  favourite: IFavourite,
  user: IUser
): Promise<IFavourite> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ message: 'manage Favourite' });
      resolve(favourite);
    }, 2000);
  });
};

const deleteFavouriteFake = (favourite: IFavourite, user: IUser) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ message: 'manage Favourite' });
      resolve(favourite);
    }, 2000);
  });
}; */

const fetchUserFake = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ message: ' ' });
      resolve({ uid: 'nZrLV3wwOJcMaIWUIqJCIfBGMjx2' });
    }, 1500);
  });
};

const logoutUserFake = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });
};

export default {
  // fetchRepo,
  // fetchForks,
  // fetchFavourites,
  // manageFavourite,
  // addFavourite,
  // deleteFavourite,
  // fetchUser,
  // logoutUser,

  fetchRepo: fetchRepoFake,
  fetchForks: fetchForksFake,
  fetchFavourites: fetchFavouritesFake,
  manageFavourite: manageFavouriteFake,
  // addFavourite: addFavouriteFake,
  // deleteFavourite: deleteFavouriteFake,
  fetchUser: fetchUserFake,
  logoutUser: logoutUserFake,
};
