import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import configureStore, {
  sagaMiddleware,
  preloadedState
} from '../services/store';
import App from '../App';
import { watchFetchForks } from '../ducks/forks';
import {
  watchFetchFavourites,
  watchManageFavourite
} from '../ducks/favourites';
import { fetchUser, watchFetchUser, watchLogoutUser } from '../ducks/user';

export const initialState = preloadedState || { appName: 'WebTouch test job' };
const store = configureStore(initialState);

sagaMiddleware.run(watchFetchForks);
sagaMiddleware.run(watchFetchFavourites);
sagaMiddleware.run(watchManageFavourite);
sagaMiddleware.run(watchFetchUser);
sagaMiddleware.run(watchLogoutUser);

store.dispatch(fetchUser());

class Main extends React.Component {
  // Remove the server-side injected CSS.
  public componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  public render() {
    return <App />;
  }
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
