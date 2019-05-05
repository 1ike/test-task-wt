import { IRepo } from './../constants';
import {
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} from 'graphql';

import API from '../services/API/forksAPI';
import { IForksResponse } from '../ducks/forks';

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

const ForksResponseType = new GraphQLObjectType({
  name: 'ForksResponseData',
  fields: () => ({
    repository: { type: RepositoryType },
    forks: { type: new GraphQLList(RepositoryType) },
    correctedPage: { type: new GraphQLNonNull(GraphQLInt) },
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
      resolve(parent, { name }) {
        return API.fetchForks(name).then(
          ({ repository }: IForksResponse): IRepo => repository
        );
      },
    },
    forksResponseData: {
      type: ForksResponseType,
      description: 'Repository & it\'s Forks',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        page: { type: new GraphQLNonNull(GraphQLInt) },
        perPage: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { name, page, perPage }) {
        return API.fetchForks(name, page, perPage);
      },
    },
  }),
});

export default new GraphQLSchema({
  query: ForksQueryRootType,
});
