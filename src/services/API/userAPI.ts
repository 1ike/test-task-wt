import { IUser } from '../../ducks/user';
import { auth } from '../../services/firebase';

const fetchUser = () => {
  return auth.signInAnonymously().then((data: { user: IUser }) => data.user);
};

const logoutUser = () => {
  return auth.signOut();
};

/* const fetchUserFake = () => {
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
}; */

export default {
  fetchUser,
  logoutUser,

  // fetchUser: fetchUserFake,
  // logoutUser: logoutUserFake,
};
