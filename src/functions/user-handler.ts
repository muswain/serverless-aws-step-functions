import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ok } from 'assert';
import { putUser, queryUsers } from '../helpers/dynamodb';
import { validateUser } from '../helpers/validation-util';

export type GetUsersEvent = Pick<APIGatewayProxyEventV2, 'queryStringParameters'>;
export type AddUserEvent = Pick<APIGatewayProxyEventV2, 'body'>;

export const getUsers = async (event: GetUsersEvent): Promise<APIGatewayProxyResultV2<User>> => {
  const name = event.queryStringParameters?.['name'];

  try {
    ok(name, 'name is required');

    const users = await queryUsers(name);
    return { statusCode: 200, body: JSON.stringify(users) };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

export const addUser = async (event: AddUserEvent): Promise<APIGatewayProxyResultV2<Response>> => {
  const body = event.body;

  try {
    ok(body, 'body is required');

    const user = JSON.parse(body);
    validateUser(user);

    await putUser(user);
    return { statusCode: 200, body: JSON.stringify({ message: 'user added successfully' }) };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
