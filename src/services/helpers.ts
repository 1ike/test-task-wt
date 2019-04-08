import { RouteName, ErrorMessage, nbsp } from '../constants';
import { FORKS_PER_PAGE } from '../ducks/forks';
import { User } from '../ducks/user';

export const createRelativePath = (
  repoName: string,
  page: number,
  perPage: number
) => {
  return `${RouteName.Search}?page=${page}&repository=${repoName} \
    ${perPage !== FORKS_PER_PAGE ? `&per_page=${perPage}` : ''}`;
};

export const isSigned = (user: User): boolean => {
  return Object.keys(user).length !== 0;
};

export const createErrorMessage = (
  falledAction: string,
  details: string
): ErrorMessage => {
  return `${falledAction} error${details.trim() ? `:${nbsp} ${details}` : ''}`;
};
