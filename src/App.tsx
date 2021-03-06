import * as React from 'react';
import { Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Layout from './components/Layout';
import EntryPoint from './pages';

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
    <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
      <CssBaseline />
      <Layout>
        <Route path='/' component={EntryPoint} />
      </Layout>
    </MuiThemeProvider>
  );
};

export default App;
