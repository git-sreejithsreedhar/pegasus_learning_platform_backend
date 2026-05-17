import { registerAs } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

export default registerAs(
  'graphql',
  (): ApolloDriverConfig => ({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    introspection: process.env.NODE_ENV !== 'production',
    playground: false,
    plugins:
      process.env.NODE_ENV === 'production'
        ? []
        : [ApolloServerPluginLandingPageLocalDefault()],

    debug: process.env.NODE_ENV === 'development', // disable Nest/Apollo debug mode
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development', // Apollo-specific flag

    cache: 'bounded',
    csrfPrevention: process.env.NODE_ENV === 'production',
    formatError: (error) => error,
  }),
);
