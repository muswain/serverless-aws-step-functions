import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from 'aws-lambda';
import { ok } from 'assert';
import { queryUsers } from 'src/helpers/dynamodb';

type HelloEvent = Pick<APIGatewayProxyEventV2, 'headers' | 'queryStringParameters'>;

export const sayHello: APIGatewayProxyHandler = async (event: HelloEvent) => {
  const name = event.queryStringParameters?.['name'];

  try {
    ok(name, 'name is required');

    const users = await queryUsers(name);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `hello ${name}`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};
