import { initializeApp, database, auth as authentication } from 'firebase';

const config = {
  apiKey: 'AIzaSyB9R8Pc4AmVvt_hV1om_duyuOew9Gd36MA',
  authDomain: 'webtouch-test-job.firebaseapp.com',
  databaseURL: 'https://webtouch-test-job.firebaseio.com',
  projectId: 'webtouch-test-job',
  storageBucket: 'webtouch-test-job.appspot.com',
  messagingSenderId: '446684636912',
};

initializeApp(config);

export const db = database();
export const auth = authentication();
