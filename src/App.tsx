import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import './App.css';

import store from './services/store';
import { db, auth } from './services/firebase';
import API from './services/API';

import Layout from './components/Layout';
import EntryPoint from './pages';

import { IUser } from './ducks/user';

const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️ / style shee
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
      },
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <Layout>
          <Route path='/' component={EntryPoint} />
        </Layout>
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;

db.ref('users/').set({
  username: 'name',
  email: 'email',
  profile_picture: 'imageUrl',
});

API.fetchUser().then((user: IUser) => console.log(user.uid));
