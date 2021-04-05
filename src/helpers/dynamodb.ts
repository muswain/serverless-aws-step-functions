import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const region = 'ap-southeast-2';
let client = process.env.IS_OFFLINE
  ? new DynamoDBClient({ region, endpoint: 'http://localhost:8000' })
  : new DynamoDBClient({ region });

const ddbDocClient = DynamoDBDocumentClient.from(client);

/**
 * Queries for users
 * @param name
 * @returns
 */
export const queryUsers = async (name: string): Promise<User[] | []> => {
  const queryCommand = new QueryCommand({
    TableName: process.env.USER_TABLE,
    IndexName: 'sk-name',
    KeyConditionExpression: 'sk = :pk AND begins_with(#user, :name)',
    ExpressionAttributeNames: { '#user': 'name' },
    ExpressionAttributeValues: { ':pk': 'profile', ':name': name },
  });

  const { Items } = await ddbDocClient.send(queryCommand);
  const users: User[] = Items.map((item) => {
    const { name, city, country, pk: email } = item;
    return { name, city, country, email };
  });

  return users;
};

/**
 * Adds a new user
 * @param user
 */
export const putUser = async (user: User) => {
  const { email } = user;
  const addUserItem: UserDBItem = {
    ...user,
    pk: email,
    sk: 'profile',
  };

  const putCommand = new PutCommand({
    TableName: process.env.USER_TABLE,
    Item: addUserItem,
    ConditionExpression: 'attribute_not_exists(pk)',
  });

  await ddbDocClient.send(putCommand);
};
