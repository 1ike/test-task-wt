import axios from 'axios';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com/repos/',
  headers: { Accept: 'application/vnd.github.v3.raw+json' },
});

const fetchRepo = async (repoName: string) => {
  return githubAPI(repoName);
};
const fetchForks = async (repoName: string, page: number = 1) => {
  return githubAPI(`${repoName}/forks`, { params: { page: page.toString() } });
};

export default {
  fetchRepo,
  fetchForks,
};
