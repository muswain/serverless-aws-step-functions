import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { expect, use } from 'chai';
import { cloneDeep } from 'lodash';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as dynamodb from '../helpers/dynamodb';
import { addUser, AddUserEvent, getUsers, GetUsersEvent } from './user-handler';
use(sinonChai);

describe('user-handler', () => {
  describe('getUsers()', () => {
    let putUserStub: sinon.SinonStub;
    const sandbox = sinon.createSandbox();

    const event: GetUsersEvent = {
      queryStringParameters: {
        name: 'test-user',
      },
    };

    beforeEach(() => {
      putUserStub = sandbox.stub(dynamodb, 'queryUsers');
    });

    afterEach(() => sandbox.restore());

    it('should call queryUsers() with the required params', async () => {
      putUserStub.resolves([{ email: 'test@example.com', name: 'test', city: 'perth', country: 'australia' }]);
      const response = (await getUsers(event)) as APIGatewayProxyStructuredResultV2;

      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.deep.equal([
        { email: 'test@example.com', name: 'test', city: 'perth', country: 'australia' },
      ]);
    });

    it('should throw error when the name query params is not provided', async () => {
      const eventWithoutQueryParams = cloneDeep(event);
      eventWithoutQueryParams.queryStringParameters = null;
      const response = (await getUsers(eventWithoutQueryParams)) as APIGatewayProxyStructuredResultV2;

      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(response.body)).to.deep.equal({ message: 'name is required' });
    });
  });

  describe('addUser()', () => {
    const mockUser = { email: 'test@exmaple.com', city: 'perth', country: 'australia', name: 'tom' };

    let putUserStub: sinon.SinonStub;
    const sandbox = sinon.createSandbox();

    const event: AddUserEvent = {
      body: JSON.stringify(mockUser),
    };

    beforeEach(() => {
      putUserStub = sandbox.stub(dynamodb, 'putUser');
    });

    afterEach(() => sandbox.restore());

    it('should call putUser() with the required params', async () => {
      putUserStub.resolves();
      const response = (await addUser(event)) as APIGatewayProxyStructuredResultV2;

      expect(putUserStub).to.have.been.calledWith({
        email: 'test@exmaple.com',
        city: 'perth',
        country: 'australia',
        name: 'tom',
      });
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.deep.equal({ message: 'user added successfully' });
    });

    it('should throw error when the user schema is not valid', async () => {
      const eventInvalid = cloneDeep(event);
      const clonedUser = { ...mockUser };
      delete clonedUser.email;

      eventInvalid.body = JSON.stringify({ clonedUser });
      const response = (await addUser(eventInvalid)) as APIGatewayProxyStructuredResultV2;
      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(response.body)).to.deep.equal({ message: 'data should NOT have additional properties' });
    });
  });
});
