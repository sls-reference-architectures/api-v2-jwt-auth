import axios from 'axios';
import qs from 'qs';

// TODO: move to config
const UserPoolDomainUrl = `https://${process.env.USER_POOL_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com`;

const createToken = async (event) => {
  const createTokenRequest = JSON.parse(event.body || '{}');
  const token = await createTokenFromCognito(createTokenRequest);

  return {
    statusCode: 201,
    body: JSON.stringify(token),
  };
};

const createTokenFromCognito = async (credentials) => {
  const body = { grant_type: 'client_credentials' };
  const axiosOptions = {
    auth: {
      username: credentials.clientId,
      password: credentials.clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    baseURL: UserPoolDomainUrl,
    validateStatus: () => true,
  };
  const {
    data: { access_token: accessToken, expires_in: expiresIn, token_type: tokenType },
  } = await axios.post('/oauth2/token', qs.stringify(body), axiosOptions);

  return {
    accessToken,
    expiresIn,
    tokenType,
  };
};

export default createToken;
