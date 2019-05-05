import express from 'express';
import * as React from 'react';
import querystring from 'querystring';

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
import graphqlHTTP from 'express-graphql';

import MyGraphQLSchema from './schema';
import configureStore from '../services/store';
import API from '../services/API/forksAPI';
import { createErrorMessage } from '../services/utils';
import { changeAppName } from '../ducks/appName';
import {
  forksRequest,
  forksSuccess,
  forksFailure,
  IForksResponse,
  FORKS_PAGE,
  FORKS_PER_PAGE
} from '../ducks/forks';
import { addError } from '../ducks/errors';
import App from '../App';
import { RouteName } from '../constants';

dotenv.config();

const appName = process.env.APP_NAME || 'WebTouch test job';
const lang = process.env.APP_LANG || 'en';
const themeColor = process.env.THEME_COLOR || '#4285f4';
const port = process.env.PORT || 3000;
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

  const repoName = req.query.repository;
  const page = parseInt(req.query.page, 10) || FORKS_PAGE;
  const perPage = parseInt(req.query.per_page, 10) || FORKS_PER_PAGE;

  try {
    store.dispatch(forksRequest());

    const {
      repository,
      forks,
      correctedPage,
    }: IForksResponse = await API.fetchForks(repoName, page, perPage);

    store.dispatch(
      forksSuccess({
        repository,
        forks,
        page: correctedPage,
        perPage,
      })
    );

    if (page !== correctedPage) {
      req.query.page = correctedPage;
      return res.redirect(`${req.path}?${querystring.stringify(req.query)}`);
    }

    res.render(index, prepareData(store, req));
  } catch (error) {
    console.error(error);
    store.dispatch(forksFailure());
    store.dispatch(addError(createErrorMessage('Fetch Forks', error.message)));
  }
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
  })
);

app.use((req, res) => {
  const store = configureStore();
  res.status(404).render(index, prepareData(store, req));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
