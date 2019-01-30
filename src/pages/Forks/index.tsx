import * as React from 'react';
import { Route } from 'react-router-dom';

import Forks from './components/Forks';

export default () => <Route path='/forks' exact={true} component={Forks} />;
