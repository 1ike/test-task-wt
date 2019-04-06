import express from 'express';
import * as React from 'react';

import { Store } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter, StaticRouterContext } from 'react-router';
import path from 'path';
import dotenv from 'dotenv';
import Helmet from 'react-helmet';
// @ts-ignore
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName
} from '@material-ui/core/styles';

import configureStore from '../services/store';
import API from '../services/API';
import { createErrorMessage } from '../services/helpers';
import { changeAppName } from '../ducks/appName';
import {
  forksRequest,
  forksSuccess,
  forksFailure,
  IRepoResponse,
  IForksResponse
} from '../ducks/forks';
import { addError } from '../ducks/errors';
import App from '../App';
import { RouteName, IRepo } from '../constants';
import * as config from '../config';

dotenv.config();

const title = process.env.APP_NAME || config.APP_NAME;
const lang = process.env.LANG || config.LANG;
const themeColor = process.env.THEME_COLOR || config.THEME_COLOR;
const withSSR = true;
const index = 'index';

const app = express();
const port = 3000;
app.use(express.static('./dist/public'));
app.set('views', './');
app.set('view engine', 'pug');

const prepareData = (
  routeStore: Store,
  req: express.Request,
  context: StaticRouterContext = {}
) => {
  routeStore.dispatch(changeAppName(title));

  const sheetsRegistry = new SheetsRegistry();
  const generateClassName = createGenerateClassName();

  const html = renderToString(
    <Provider store={routeStore}>
      <StaticRouter location={req.url} context={context}>
        <JssProvider
          registry={sheetsRegistry}
          generateClassName={generateClassName}
        >
          <App />
        </JssProvider>
      </StaticRouter>
    </Provider>
  );

  const helmet = Helmet.renderStatic();
  const serverTitle = helmet.title.toString();

  const css = sheetsRegistry.toString();

  return {
    withSSR,
    options: {
      lang,
      themeColor,
      title: serverTitle,
    },
    css,
    html,
    preloadedState: routeStore.getState(),
  };
};

app.get([RouteName.Home, RouteName.Favourites], (req, res) => {
  const store = configureStore();
  res.render(index, prepareData(store, req));
});

app.get(RouteName.Search, async (req, res) => {
  const store = configureStore();

  const { repository: repoName, page, perPage } = req.query;
  try {
    store.dispatch(forksRequest());

    const repoResponse: IRepoResponse = await API.fetchRepo(repoName);
    const forksResponse: IForksResponse = await API.fetchForks(
      repoName,
      page,
      perPage
    );

    store.dispatch(
      forksSuccess({
        repo: repoResponse.data,
        forks: forksResponse.data,
        page,
        // page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
      })
    );
    res.render(index, prepareData(store, req));
  } catch (error) {
    console.error(error);
    store.dispatch(forksFailure());
    store.dispatch(addError(createErrorMessage('Fetch Forks', error.message)));
  }
});

app.use((req, res) => {
  // const store = configureStore();
  // res.status(404).render(index, prepareData(store, req));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
