import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyB9R8Pc4AmVvt_hV1om_duyuOew9Gd36MA',
  authDomain: 'webtouch-test-job.firebaseapp.com',
  databaseURL: 'https://webtouch-test-job.firebaseio.com',
  projectId: 'webtouch-test-job',
  storageBucket: 'webtouch-test-job.appspot.com',
  messagingSenderId: '446684636912',
};

firebase.initializeApp(config);

export const db = firebase.database();
export const auth = firebase.auth();
