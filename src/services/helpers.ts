import { RouteName } from '../constants';
import history from '../services/history';
import { FORKS_PER_PAGE } from '../ducks/forks';

export const redirectTo = (path: string) => {
  history.push(path);
};

export const createRelativePath = (
  repoName: string,
  page: number,
  perPage: number
) => {
  return `${RouteName.Search}?page=${page}&repository=${encodeURIComponent(
    repoName
  )}${perPage !== FORKS_PER_PAGE ? `&per_page=${perPage}` : ''}`;
};
