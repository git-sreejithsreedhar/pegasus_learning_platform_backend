// src/core/config/graphql.config.ts
import { registerAs } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLError } from 'graphql';
import { Request, Response } from 'express';

// Define proper interfaces for request body
interface GraphQLRequestBody {
  operationName?: string;
  variables?: Record<string, unknown>;
  query?: string;
  extensions?: Record<string, unknown>;
}

interface GraphQLException {
  stacktrace?: string[];
  status?: number;
  response?: {
    message?: string | string[];
    statusCode?: number;
  };
}

interface GraphQLErrorDetails {
  message: string;
  code?: string;
  stacktrace?: string[];
  status?: number;
  path?: readonly (string | number)[];
  originalError?: {
    message?: string | string[];
    statusCode?: number;
  };
}

export default registerAs(
  'graphql',
  (): ApolloDriverConfig => ({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    debug: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',

    context: ({ req, res }: { req: Request; res: Response }) => {
      // Log GraphQL operations in development with proper typing
      if (
        process.env.NODE_ENV === 'development' &&
        req &&
        req.body &&
        typeof req.body === 'object'
      ) {
        const body = req.body as GraphQLRequestBody;

        console.log('GraphQL Operation:', {
          operationName: body.operationName,
          variables: body.variables,
          query: body.query,
        });
      }

      return { req, res };
    },

    formatError: (error: GraphQLError) => {
      const exception = error.extensions?.exception as
        | GraphQLException
        | undefined;

      const details: GraphQLErrorDetails = {
        message: error.message,
        code: error.extensions?.code as string | undefined,
        stacktrace: exception?.stacktrace,
        status: exception?.status,
        path: error.path,
        originalError: exception?.response,
      };

      // Log full error in development, sanitized in production
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL Error Details:', {
          message: details.message,
          code: details.code,
          path: details.path,
          stacktrace: details.stacktrace?.[0]?.split('\n').slice(0, 3), // First 3 lines only
        });
      } else {
        console.error('GraphQL Error:', {
          message: details.message,
          code: details.code,
          path: details.path,
        });
      }

      // Handle class-validator errors
      if (
        details.originalError &&
        Array.isArray(details.originalError.message)
      ) {
        return {
          message: 'Validation Error',
          statusCode: details.originalError.statusCode || 400,
          path: details.path,
          timestamp: new Date().toISOString(),
          errors: details.originalError.message,
        };
      }

      // Handle specific error types
      if (details.originalError?.message) {
        const errorMessage = Array.isArray(details.originalError.message)
          ? details.originalError.message.join(', ')
          : details.originalError.message;

        return {
          message: errorMessage,
          statusCode: details.originalError.statusCode || details.status || 500,
          path: details.path,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        message: details.message,
        statusCode: details.status || 500,
        path: details.path,
        timestamp: new Date().toISOString(),
      };
    },

    // Additional Apollo Server options
    introspection: process.env.NODE_ENV !== 'production',

    // Cache control
    cache: 'bounded',

    // CORS configuration
    // cors: {
    //   origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
    //   credentials: true,
    // },

    // CSRF prevention
    csrfPrevention: process.env.NODE_ENV === 'production',
  }),
);
