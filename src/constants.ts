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

/**
 * INTERFACES / TYPES
 */

export type ErrorMessage = string;

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
