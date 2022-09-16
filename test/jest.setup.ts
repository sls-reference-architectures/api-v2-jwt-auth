import {
  getRestServiceEndpoint as getApiUrl,
  getScopedTestClientId,
  getScopedTestClientSecret,
  getScopedTestToken,
  getStack,
  getUnScopedTestClientId,
  getUnscopedTestClientSecret,
  getUnScopedTestToken,
  getUserPoolDomain,
  getUserPoolId,
} from './setupUtils';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async (): Promise<void> => {
  const stackName = `api-v2-jwt-auth-${stage}`;

  const stack = await getStack(stackName);
  const apiUrl = getApiUrl(stack);
  const userPoolId = getUserPoolId(stack);
  const userPoolDomain = getUserPoolDomain(stack);
  const scopedTestClientId = getScopedTestClientId(stack);
  const scopedTestClientSecret = await getScopedTestClientSecret(stack);
  const scopedTestToken = await getScopedTestToken(stack);
  const unscopedTestClientId = getUnScopedTestClientId(stack);
  const unscopedTestClientSecret = await getUnscopedTestClientSecret(stack);
  const unscopedTestToken = await getUnScopedTestToken(stack);

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.API_URL = apiUrl;
  process.env.USER_POOL_ID = userPoolId;
  process.env.USER_POOL_DOMAIN = userPoolDomain;
  process.env.SCOPED_TEST_CLIENT_ID = scopedTestClientId;
  process.env.SCOPED_TEST_CLIENT_SECRET = scopedTestClientSecret;
  process.env.SCOPED_TEST_TOKEN = scopedTestToken.accessToken;
  process.env.UNSCOPED_TEST_CLIENT_ID = unscopedTestClientId;
  process.env.UNSCOPED_TEST_CLIENT_SECRET = unscopedTestClientSecret;
  process.env.UNSCOPED_TEST_TOKEN = unscopedTestToken.accessToken;
};

export default setup;
