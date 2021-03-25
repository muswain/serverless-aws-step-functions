import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from 'aws-lambda';
import { ok } from 'assert';

type HelloEvent = Pick<APIGatewayProxyEventV2, 'headers' | 'queryStringParameters'>;

export const sayHello: APIGatewayProxyHandler = async (event: HelloEvent) => {
  const name = event.queryStringParameters['name'];

  ok(name, 'name is required');

  return { statusCode: 200, body: `hello ${name}` };
};
