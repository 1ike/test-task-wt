import { validate } from 'validate.js';

/**
 * Username may only contain alphanumeric characters or single hyphens,
 * and cannot begin or end with a hyphen
 */

export const validateRepo = (repo: any) => {
  // console.log('repo', repo);
  const constraints = {
    repoInput: {
      presence: true,
      format: {
        pattern: '^([a-z0-9]([a-z0-9]|-(?!-))*[a-z0-9]|[a-z0-9])/[a-z0-9-_]+',
        flags: 'i',
        message: '^invalid repo name (must be like owner/repositoryName)',
      },
    },
  };

  const res = validate(repo, constraints);
  // console.log('res', res);
  return res;
  // return validate(repo, constraints);
};
