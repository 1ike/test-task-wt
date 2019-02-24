import axios from 'axios';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com/repos/',
  headers: { Accept: 'application/vnd.github.v3.raw+json' },
});

const fetchRepo = async (repoName: string) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve({ data: {} });
  //   }, 1000);
  // });
  return githubAPI(repoName);
};
const fetchForks = async (repoName: string, page: number, perPage: number) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve({ data: [] });
  //   }, 1000);
  // });
  return githubAPI(`${repoName}/forks`, {
    params: { page: page.toString(), per_page: perPage.toString() },
  });
};

export default {
  fetchRepo,
  fetchForks,
};
