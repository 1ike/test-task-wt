import axios, { AxiosResponse } from 'axios';
import {
  FORKS_PAGE,
  FORKS_PER_PAGE,
  IForksResponse,
  Forks as ForksType
} from '../../ducks/forks';
import { IRepo } from '../../constants';
import { correctPageValue } from '../utils';

import Repo from '../../../__tests__/__fixtures__/repository';
import Forks from '../../../__tests__/__fixtures__/forks';

const githubREST = axios.create({
  baseURL: 'https://api.github.com/repos/',
  headers: { Accept: 'application/vnd.github.v3.raw+json' },
});

const fetchForks = async (
  repoName: string,
  page = FORKS_PAGE,
  perPage = FORKS_PER_PAGE
): Promise<IForksResponse> => {
  const { data: repo }: AxiosResponse<IRepo> = await githubREST(repoName);
  const { data: forks }: AxiosResponse<ForksType> = await githubREST(
    `${repoName}/forks`,
    {
      params: { page: page.toString(), per_page: perPage.toString() },
    }
  );

  const correctedPage = correctPageValue(page, perPage, repo.forks_count);

  return { repo, forks, correctedPage };
};

/**
 * Fakes
 */

const fetchForksFake = (
  repoName: string,
  page = FORKS_PAGE,
  perPage = FORKS_PER_PAGE
): Promise<IForksResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject({ message: 'fetch Forks' });

      const correctedPage = correctPageValue(
        page,
        perPage,
        Repo.data.forks_count
      );

      resolve({
        repo: Repo.data,
        forks: Forks.data,
        correctedPage,
      });
    }, 0);
  });
};

export default {
  // fetchForks,

  fetchForks: fetchForksFake,
};
