import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

export const queryUsers = async (name: string) => {
  const client = new DynamoDBClient({ endpoint: 'localhost:8000' });
  const queryCommand = new QueryCommand({
    TableName: process.env.USER_TABLE,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': name,
    },
  });

  try {
    const response = await client.send(queryCommand);
    console.info(response);
    return response;
  } catch (err) {
    console.error(err);
  }
};
