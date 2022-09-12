import axios from "axios";
import qs from "qs";

// TODO: move to config
const UserPoolDomain =
  "https://ra-http-api-auth-dev.auth.us-east-1.amazoncognito.com";

const getToken = async (credentials: GetTokenRequest): Promise<AccessToken> => {
  const body = { grant_type: "client_credentials" };
  const axiosOptions = {
    auth: {
      username: credentials.clientId,
      password: credentials.clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    baseURL: UserPoolDomain,
  };
  const {
    data: {
      access_token: accessToken,
      expires_in: expiresIn,
      token_type: tokenType,
    },
  } = await axios.post("/oauth2/token", qs.stringify(body), axiosOptions);

  return {
    accessToken,
    expiresIn,
    tokenType,
  };
};

interface GetTokenRequest {
  clientId: string;
  clientSecret: string;
}

interface AccessToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export { AccessToken, getToken };
