import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { RouteName } from '../constants';
import Home from './Home';
import Search from './Search';
import NotFound from './NotFound';

const IndexPage = () => {
  return (
    <Switch>
      <Route path={RouteName.Home} exact={true} component={Home} />
      <Route path={RouteName.Search} component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
};
 
export default IndexPage;
