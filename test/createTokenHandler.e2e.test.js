import handler from '../src/createTokenHandler';
import { createApiGatewayEvent } from './awsUtils';

describe('When invoking the creteToken handler', () => {
  describe('with a valid payload', () => {
    it('should return 201 status code', async () => {
      // ARRANGE
      const payload = {
        clientId: process.env.SCOPED_TEST_CLIENT_ID ?? '',
        clientSecret: process.env.SCOPED_TEST_CLIENT_SECRET ?? '',
      };
      const event = createApiGatewayEvent(payload);

      // ACT
      const createTokenResult = await handler(event);

      // ASSERT
      expect(createTokenResult?.statusCode).toEqual(201);
    });

    it('should have JWT in the body', async () => {
      // ARRANGE
      const payload = {
        clientId: process.env.SCOPED_TEST_CLIENT_ID ?? '',
        clientSecret: process.env.SCOPED_TEST_CLIENT_SECRET ?? '',
      };
      const event = createApiGatewayEvent(payload);

      // ACT
      const createTokenResult = await handler(event);

      // ASSERT
      const jwt = JSON.parse(createTokenResult.body);
      expect(jwt).toHaveProperty('accessToken');
      expect(jwt).toHaveProperty('expiresIn');
      expect(jwt.tokenType).toEqual('Bearer');
    });
  });
});
