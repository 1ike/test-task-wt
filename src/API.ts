import axios from 'axios';

const fetchForks = async (repoName: string) => {
  console.log('axios get ' + repoName);
  return axios('https://api.github.com/repos/' + repoName + '/forks');
};

export default {
  fetchForks,
};
