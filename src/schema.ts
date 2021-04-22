import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { mergeTypeDefs } from '@graphql-tools/merge';

const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.ts`);
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.ts`);

export const resolvers = mergeResolvers(loadedResolvers);
export const typeDefs = mergeTypeDefs(loadedTypes);
