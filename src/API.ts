import axios from 'axios';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com/repos/',
  headers: {Accept: 'application/vnd.github.v3.raw+json'},
});


const fetchRepo = async (repoName: string) => {
  return githubAPI(repoName);
};
const fetchForks = async (repoName: string) => {
  return githubAPI(`${repoName}/forks`);
};

export default {
  fetchRepo,
  fetchForks,
};
