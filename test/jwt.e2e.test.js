import axios from 'axios';

describe('When hitting a protected endpoint', () => {
  describe('with a valid, scoped JWT as bearer token', () => {
    it('should succeed', async () => {
      // ARRANGE
      const axiosOptions = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.SCOPED_TEST_TOKEN}`,
        },
      };

      // ACT
      const { status } = await axios.get('/hello', axiosOptions);

      // ASSERT
      expect(status).toEqual(200);
    });
  });

  describe('with a valid, scoped JWT as api key (no Bearer)', () => {
    it('should succeed', async () => {
      // ARRANGE
      const axiosOptions = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `${process.env.SCOPED_TEST_TOKEN}`,
        },
      };

      // ACT
      const { status } = await axios.get('/hello', axiosOptions);

      // ASSERT
      expect(status).toEqual(200);
    });
  });

  describe('with a bad JWT Bearer token', () => {
    it('should fail with 401 (Unauthorized)', async () => {
      // ARRANGE
      const axiosOptions = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: 'Bearer xyz',
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.get('/hello', axiosOptions);

      // ASSERT
      expect(status).toEqual(401);
    });
  });
});
