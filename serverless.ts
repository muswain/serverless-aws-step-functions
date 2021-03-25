import type { AWS } from '@serverless/typescript';



const serverlessConfiguration: AWS = {
  service: 'serverless-step-functions',
  frameworkVersion: '>=2.30.0',

  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    functionsBasePath: 'src/functions'
  },
  plugins: ['serverless-webpack', 'serverless-functions-base-path'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    memorySize: 128,
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
      handler: 'hello-handler.sayHello',
      description: 'hello handler function',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
            cors: true
          }
        }
      ]
    }
  },

}

module.exports = serverlessConfiguration;
