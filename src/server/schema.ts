import {
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} from 'graphql';

import repo from '../../__tests__/__fixtures__/repository';
import forks from '../../__tests__/__fixtures__/forks';

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    login: { type: new GraphQLNonNull(GraphQLString) },
    html_url: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const RepositoryType = new GraphQLObjectType({
  name: 'Repository',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    node_id: { type: new GraphQLNonNull(GraphQLString) },
    full_name: { type: new GraphQLNonNull(GraphQLString) },
    html_url: { type: new GraphQLNonNull(GraphQLString) },
    forks_count: { type: new GraphQLNonNull(GraphQLInt) },
    stargazers_count: { type: new GraphQLNonNull(GraphQLInt) },
    owner: { type: new GraphQLNonNull(OwnerType) },
  }),
});

const ForksQueryRootType = new GraphQLObjectType({
  name: 'ForksSchema',
  fields: () => ({
    repository: {
      type: RepositoryType,
      description: 'Repository from Github',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve() {
        return repo.data;
      },
    },
    forks: {
      type: new GraphQLList(RepositoryType),
      description: 'Forks of the Repository',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        page: { type: new GraphQLNonNull(GraphQLInt) },
        perPage: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve() {
        return forks.data;
      },
    },
    fork: {
      type: RepositoryType,
      description: 'Forks of the Repository',
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { id }) {
        return forks.data.find((fork) => id === fork.id);
      },
    },
  }),
});

export default new GraphQLSchema({
  query: ForksQueryRootType,
});
