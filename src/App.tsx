import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Hello from './components/Forks';
import Home from './components/Home';
import Layout from './components/Layout';
import NotFound from './components/NotFound';

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
    <React.Fragment>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <Layout>
          <Switch>
            <Route path='/' exact={true} component={Home} />
            <Route path='/forks' exact={true} component={Hello} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </MuiThemeProvider>
    </React.Fragment>
  );
};

export default App;
