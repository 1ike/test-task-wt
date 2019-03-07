import * as React from 'react';
import { Route } from 'react-router-dom';

import { RouteName } from '../../constants';
import FavouriteForks from './components/Favourites';

export default () => (
  <Route path={RouteName.Favourites} exact={true} component={FavouriteForks} />
);
