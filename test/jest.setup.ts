import {
  getRestServiceEndpoint as getApiUrl,
  getScopedTestClientId,
  getScopedTestClientSecret,
  getStack,
  getUnScopedTestClientId,
  getUnscopedTestClientSecret,
  getUserPoolId,
} from "./setupUtils";

const region = process.env.AWS_REGION || "us-east-1";
const stage = process.env.STAGE || "dev";

const setup = async (): Promise<void> => {
  const stackName = `api-v2-jwt-auth-${stage}`;

  const stack = await getStack(stackName);
  const apiUrl = getApiUrl(stack);
  const userPoolId = getUserPoolId(stack);
  const scopedTestClientId = getScopedTestClientId(stack);
  const scopedTestClientSecret = await getScopedTestClientSecret(stack);
  const unscopedTestClientId = getUnScopedTestClientId(stack);
  const unscopedTestClientSecret = await getUnscopedTestClientSecret(stack);

  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.NODE_ENV = stage;
  process.env.API_URL = apiUrl;
  process.env.USER_POOL_ID = userPoolId;
  process.env.SCOPED_TEST_CLIENT_ID = scopedTestClientId;
  process.env.SCOPED_TEST_CLIENT_SECRET = scopedTestClientSecret;
  process.env.UNSCOPED_TEST_CLIENT_ID = unscopedTestClientId;
  process.env.UNSCOPED_TEST_CLIENT_SECRET = unscopedTestClientSecret;
};

export default setup;
