import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
console.log(window);
import configureStore, {
  sagaMiddleware,
  preloadedState
} from '../services/store';
import App from '../App';
import forksReducer, { IForksState, watchFetchForks } from '../ducks/forks';
import favouritesReducer, {
  IFavouritesState,
  watchFetchFavourites,
  watchManageFavourite
} from '../ducks/favourites';
import userReducer, {
  IUserState,
  fetchUser,
  watchFetchUser,
  watchLogoutUser
} from '../ducks/user';
import { APP_NAME } from '../config';

export const initialState = preloadedState || { appName: APP_NAME };
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
console.log(window);
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
