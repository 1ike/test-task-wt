import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { RouteName } from '../constants';
import Home from './Home';
import Search from './Search';
import Favourites from './Favourites';
import NotFound from './NotFound';

const IndexPage = () => {
  return (
    <Switch>
      <Route path={RouteName.Home} exact={true} component={Home} />
      <Route path={RouteName.Search} component={Search} />
      <Route path={RouteName.Favourites} component={Favourites} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default IndexPage;
