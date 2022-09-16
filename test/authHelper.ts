// import axios, { AxiosRequestConfig } from 'axios';
// import qs from 'qs';

// const userPoolDomain = process.env.USER_POOL_DOMAIN;
// const region = process.env.AWS_REGION;

// const getTestToken = async (credentials: GetTokenRequest): Promise<AccessToken> => {
//   const body = { grant_type: 'client_credentials' };
//   const axiosOptions: AxiosRequestConfig = {
//     auth: {
//       username: credentials.clientId,
//       password: credentials.clientSecret,
//     },
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     baseURL: `https://${userPoolDomain}.auth.${region}.amazoncognito.com`,
//     validateStatus: () => true,
//   };
//   console.log(axiosOptions)
//   const { status, data } = await axios.post('/oauth2/token', qs.stringify(body), axiosOptions);
//   console.log(data);
//   expect(status).toEqual(200);
//   const { access_token: accessToken, expires_in: expiresIn, token_type: tokenType } = data;

//   return {
//     accessToken,
//     expiresIn,
//     tokenType,
//   };
// };

// interface GetTokenRequest {
//   clientId: string;
//   clientSecret: string;
// }

// interface AccessToken {
//   accessToken: string;
//   expiresIn: number;
//   tokenType: string;
// }

// export { AccessToken};
