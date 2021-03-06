export enum RouteName {
  Home = '/',
  Search = '/search',
  Favourites = '/favourites',
}

export enum RequestState {
  Requested = 'requested',
  Failed = 'failed',
  Successed = 'successed',
  None = 'none',
}

export const nbsp = '\u00A0';

/**
 * INTERFACES / TYPES
 */

export interface IRepo {
  id: number;
  node_id: string;
  full_name: string;
  html_url: string;
  forks_count: number;
  stargazers_count: number;
  owner: {
    login: string;
    html_url: string;
  };
}
