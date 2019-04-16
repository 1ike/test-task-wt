import { IFavourite, Favourites, ManageAction } from '../../ducks/favourites';
import { IUser } from '../../ducks/user';
import { db } from '../../services/firebase';

import repo from '../../../__tests__/__fixtures__/repository';
import favourites from '../../../__tests__/__fixtures__/favourites';

const fetchFavourites = (user: IUser): Promise<Favourites> => {
  return db
    .ref(user.uid)
    .once('value')
    .then((snapshot) => {
      console.log(snapshot.val());
      const data = snapshot.val();
      return data ? Object.keys(data).map((key) => data[key]) : [];
    });
};

const manageFavourite = (
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

/**
 * Fakes
 */

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

export default {
  // fetchFavourites,
  // manageFavourite,
  // addFavourite,
  // deleteFavourite,

  fetchFavourites: fetchFavouritesFake,
  manageFavourite: manageFavouriteFake,
  // addFavourite: addFavouriteFake,
  // deleteFavourite: deleteFavouriteFake,
};
