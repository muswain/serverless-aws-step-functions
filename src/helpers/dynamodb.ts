import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const region = 'ap-southeast-2';
let client = process.env.IS_OFFLINE
  ? new DynamoDBClient({ region, endpoint: 'localhost:8000' })
  : new DynamoDBClient({ region });

const ddbDocClient = DynamoDBDocumentClient.from(client);

export const queryUsers = async (name: string): Promise<User[]> => {
  const queryCommand = new QueryCommand({
    TableName: process.env.USER_TABLE,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': name,
    },
  });

  const { Items } = await ddbDocClient.send(queryCommand);

  const users: User[] = Items.map((item) => {
    const { pk: name, city, state } = item;
    return {
      name,
      city,
      state,
    };
  });

  return users;
};
