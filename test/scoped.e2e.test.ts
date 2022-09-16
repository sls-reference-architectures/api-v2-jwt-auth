import axios, { AxiosRequestConfig } from 'axios';

describe('When hitting a protected endpoint that requires a scope', () => {
  describe('with a scoped token', () => {
    it('should succeed', async () => {
      // ARRANGE
      const axiosOptions: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.SCOPED_TEST_TOKEN}`,
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.get('/bonjour', axiosOptions);

      // ASSERT
      expect(status).toEqual(200);
    });
  });

  describe('with a token missing the required scope', () => {
    // let bonjourlessToken: string;

    // beforeAll(async () => {
    //   const credentials = {
    //     clientId: process.env.UNSCOPED_TEST_CLIENT_ID ?? "",
    //     clientSecret: process.env.UNSCOPED_TEST_CLIENT_SECRET ?? "",
    //   };
    //   ({ accessToken: bonjourlessToken } = await getToken(credentials));
    // });

    it('should fail', async () => {
      // ARRANGE
      const axiosOptions: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${process.env.UNSCOPED_TEST_TOKEN}`,
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.get('/bonjour', axiosOptions);

      // ASSERT
      expect(status).toEqual(403);
    });
  });
});
