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

/**
 * REST
 */

const githubREST = axios.create({
  baseURL: 'https://api.github.com/repos/',
  headers: { Accept: 'application/vnd.github.v3.raw+json' },
});

const fetchForks = async (
  repoName: string,
  page = FORKS_PAGE,
  perPage = FORKS_PER_PAGE
): Promise<IForksResponse> => {
  const { data: repository }: AxiosResponse<IRepo> = await githubREST(repoName);
  const { data: forks }: AxiosResponse<ForksType> = await githubREST(
    `${repoName}/forks`,
    {
      params: { page: page.toString(), per_page: perPage.toString() },
    }
  );

  const correctedPage = correctPageValue(page, perPage, repository.forks_count);

  return { repository, forks, correctedPage };
};

/**
 * GraphQL
 */

const myServerGQL = axios.create({
  baseURL: 'http://localhost:3000/graphql/',
});

const fetchForksGQL: typeof fetchForks = async (
  repoName,
  page = FORKS_PAGE,
  perPage = FORKS_PER_PAGE
) => {
  const repoSelectionSet = `
    id,
    node_id,
    full_name,
    html_url,
    forks_count,
    stargazers_count,
    owner {
      login,
      html_url
    }
  `;
  const query = `{
    forksResponseData(name: "${repoName}", page: ${page}, perPage:${perPage}) {
      repository {
        ${repoSelectionSet}
      }
      forks {
        ${repoSelectionSet}
      },
      correctedPage
    }
  }`;

  const {
    data: {
      data: { forksResponseData },
    },
  }: AxiosResponse<{
    data: { forksResponseData: IForksResponse };
  }> = await myServerGQL.post('/', { query });

  return forksResponseData;
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
        repository: Repo.data,
        forks: Forks.data,
        correctedPage,
      });
    }, 0);
  });
};

export default {
  // fetchForks,
  fetchForksGQL,

  fetchForks: fetchForksFake,
};
