import type { AWS } from '@serverless/typescript';
// DynamoDB
import dynamoDbTables from './resources/dynamodb-tables';

const serverlessConfiguration: AWS = {
  service: 'serverless-step-functions',
  frameworkVersion: '>=2.30.0',

  custom: {
    resourcePrefix: '${self:service}',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    functionsBasePath: 'src/functions',
    'serverless-offline': {
      httpPort: 3000,
      host: 'localhost',
    },
    dynamodb: {
      // If you only want to use DynamoDB Local in some stages, declare them here
      stages: ['dev'],
      start: {
        port: 8000,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        // Uncomment only if you already have a DynamoDB running locally
        // noStart: true
      },
    },
  },
  plugins: ['serverless-functions-base-path', 'serverless-dynamodb-local', 'serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    memorySize: 256,
    stage: 'dev',
    region: 'ap-southeast-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  package: {
    individually: true,
  },
  functions: {
    SayHello: {
      handler: '/hello-handler.sayHello',
      description: 'hello handler function',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
          },
        },
      ],
    },
  },
  resources: {
    Resources: dynamoDbTables,
  },
};

module.exports = serverlessConfiguration;
