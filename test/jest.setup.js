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

const setup = async () => {
  const appStackName = `api-v2-jwt-auth-${stage}`;
  const infraStackName = `api-v2-jwt-auth-infra-${stage}`;
  const appStack = await getStack(appStackName);
  const infraStack = await getStack(infraStackName);

  const apiUrl = getApiUrl(appStack);
  const userPoolId = getUserPoolId(infraStack);
  const userPoolDomain = getUserPoolDomain(infraStack);
  const scopedTestClientId = getScopedTestClientId(infraStack);
  const scopedTestClientSecret = await getScopedTestClientSecret(infraStack);
  const scopedTestToken = await getScopedTestToken(infraStack);
  console.log('scopedTestToken', scopedTestToken);
  const unscopedTestClientId = getUnScopedTestClientId(infraStack);
  const unscopedTestClientSecret = await getUnscopedTestClientSecret(infraStack);
  const unscopedTestToken = await getUnScopedTestToken(infraStack);

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
  console.log(process.env);
};

export default setup;
