import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { ok } from 'assert';
import { putUser, queryUsers } from '../helpers/dynamodb';

export type GetUsersEvent = Pick<APIGatewayProxyEventV2, 'queryStringParameters'>;
export type AddUserEvent = Pick<APIGatewayProxyEventV2, 'body'>;

export const getUsers = async (event: GetUsersEvent): Promise<APIGatewayProxyResult> => {
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

export const addUser = async (event: AddUserEvent): Promise<APIGatewayProxyResult> => {
  const body = event.body;

  try {
    ok(body, 'body is required');

    const user = JSON.parse(body);

    await putUser(user);
    return { statusCode: 200, body: 'user added successfully' };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
