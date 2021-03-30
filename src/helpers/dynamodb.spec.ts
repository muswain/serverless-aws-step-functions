import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { expect, use } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as chaiSubset from 'chai-subset';
use(sinonChai);
use(chaiSubset);
import { queryUsers } from './dynamodb';

describe('dynamodb helper', () => {
  let queryStub: sinon.SinonStub;

  before(() => {
    process.env.USER_TABLE = 'users';
    queryStub = sinon.stub(DynamoDBDocumentClient.prototype, 'send');
  });

  afterEach(() => queryStub.reset());

  describe('queryUsers', () => {
    it('should query ddb and get list of users', async () => {
      queryStub.resolves({ Items: [{ pk: 'mj', name: 'mswain', city: 'perth', country: 'australia' }] });
      const response = await queryUsers('test user');
      expect(response).to.deep.equal([{ name: 'mswain', city: 'perth', country: 'australia', email: 'mj' }]);
    });

    it('should query ddb with the required params', async () => {
      queryStub.resolves({ Items: [] });
      await queryUsers('test user');

      expect(queryStub).to.have.been.calledWithMatch({
        QueryCommand: {
          input: {
            TableName: 'users',
            IndexName: 'sk-name',
            KeyConditionExpression: 'sk = :pk AND begins_with(#user, :name)',
            ExpressionAttributeNames: [Object],
            ExpressionAttributeValues: [Object],
          },
        },
      });
    });
  });
});
