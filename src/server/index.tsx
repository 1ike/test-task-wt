import express from 'express';
import * as React from 'react';

import { Store } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter, StaticRouterContext } from 'react-router';
import dotenv from 'dotenv';
import Helmet from 'react-helmet';
// @ts-ignore
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';

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
import { RouteName } from '../constants';

dotenv.config();

const appName = process.env.APP_NAME;
const lang = process.env.APP_LANG;
const themeColor = process.env.THEME_COLOR;
const port = process.env.SERVER_PORT || 3000;
const index = 'index';

const app = express();
app.use(express.static('./dist/client'));
app.set('views', './');
app.set('view engine', 'pug');

const prepareData = (
  routeStore: Store,
  req: express.Request,
  context: StaticRouterContext = {}
) => {
  routeStore.dispatch(changeAppName(appName));

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
  const title = helmet.title.toString();

  const css = sheetsRegistry.toString();

  return {
    options: {
      lang,
      themeColor,
      title,
    },
    withSSR: true,
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
        page: parseInt(page, 10),
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
  const store = configureStore();
  res.status(404).render(index, prepareData(store, req));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
