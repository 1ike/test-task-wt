import * as React from 'react';
import { Route } from 'react-router-dom';

import { RouteName } from '../../constants';
import Forks from './components/Search';

export default () => (
  <Route path={RouteName.Search} exact={true} component={Forks} />
);
