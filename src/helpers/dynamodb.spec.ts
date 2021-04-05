import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { expect, use } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
use(sinonChai);
import { putUser, queryUsers } from './dynamodb';

describe('dynamodb helper', () => {
  describe('queryUsers', () => {
    let queryStub: sinon.SinonStub;
    const sandbox = sinon.createSandbox();

    before(() => (process.env.USER_TABLE = 'users'));

    beforeEach(() => {
      queryStub = sandbox.stub(DynamoDBDocumentClient.prototype, 'send');
    });

    afterEach(() => sandbox.restore());

    it('should query ddb and get list of users', async () => {
      queryStub.resolves({ Items: [{ pk: 'mj', name: 'mswain', city: 'perth', country: 'australia' }] });
      const response = await queryUsers('test user');
      expect(response).to.deep.equal([{ name: 'mswain', city: 'perth', country: 'australia', email: 'mj' }]);
    });

    it('should query ddb with the required params', async () => {
      queryStub.resolves({ Items: [] });
      await queryUsers('test user');
      expect(queryStub).to.have.been.calledOnce;
      expect(queryStub).to.have.been.calledWithMatch({
        input: {
          TableName: 'users',
          IndexName: 'sk-name',
          KeyConditionExpression: 'sk = :pk AND begins_with(#user, :name)',
          ExpressionAttributeNames: { '#user': 'name' },
          ExpressionAttributeValues: { ':pk': 'profile', ':name': 'test user' },
        },
      });
    });
  });

  describe('putUser', () => {
    let putStub: sinon.SinonStub;
    const sandbox = sinon.createSandbox();
    const mockUser = { email: 'test@exmaple.com', city: 'perth', country: 'australia', name: 'tom' };

    before(() => (process.env.USER_TABLE = 'users'));

    beforeEach(() => {
      putStub = sandbox.stub(DynamoDBDocumentClient.prototype, 'send');
    });

    afterEach(() => sandbox.restore());

    it('should add the user successfully', async () => {
      putStub.resolves();
      const response = await putUser(mockUser);
      expect(response).to.be.undefined;
    });

    it('should add item in ddb with the required params', async () => {
      putStub.resolves();
      await putUser(mockUser);
      expect(putStub).to.have.been.calledOnce;
      expect(putStub).to.have.been.calledWithMatch({
        input: {
          TableName: 'users',
          Item: {
            name: 'tom',
            city: 'perth',
            country: 'australia',
            pk: 'test@exmaple.com',
            sk: 'profile',
          },
          ConditionExpression: 'attribute_not_exists(pk)',
        },
      });
    });
  });
});
