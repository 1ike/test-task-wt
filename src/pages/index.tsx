import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Forks from './Forks';
import NotFound from './NotFound';

const IndexPage = () => {
  return (
    <Switch>
      <Route path='/' exact={true} component={Home} />
      <Route path='/forks' component={Forks} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default IndexPage;
