/* eslint-disable import/no-extraneous-dependencies */
import { CloudFormationClient, DescribeStacksCommand, Stack } from '@aws-sdk/client-cloudformation';
import {
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  APIGatewayClient,
  GetApiKeysCommand,
  GetApiKeysCommandInput,
} from '@aws-sdk/client-api-gateway';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

const region = process.env.AWS_REGION || 'us-east-1';
const cognitoClient = new CognitoIdentityProviderClient({ region });
const apiGatewayClient = new APIGatewayClient({ region });

export const getRestServiceEndpoint = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue;

export const getUserPoolId = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiAuthUserPoolId')?.OutputValue;

export const getScopedTestClientId = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'ScopedTestClientId')?.OutputValue ?? '';

export const getUnScopedTestClientId = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'UnScopedTestClientId')?.OutputValue ?? '';

export const getUserPoolDomain = (stack: Stack) =>
  stack.Outputs?.find((o) => o.OutputKey === 'HttpApiAuthUserPoolDomain')?.OutputValue ?? '';

export const getApiKey = async (name: string) => {
  const input: GetApiKeysCommandInput = {
    nameQuery: name,
    includeValues: true,
  };
  const { items } = await apiGatewayClient.send(new GetApiKeysCommand(input));

  return items?.[0];
};

export const getScopedTestClientSecret = async (stack: Stack) => {
  const { UserPoolClient }: DescribeUserPoolClientResponse = await cognitoClient.send(
    new DescribeUserPoolClientCommand({
      UserPoolId: getUserPoolId(stack),
      ClientId: getScopedTestClientId(stack),
    }),
  );

  return UserPoolClient?.ClientSecret ?? '';
};

export const getUnscopedTestClientSecret = async (stack: Stack) => {
  const { UserPoolClient }: DescribeUserPoolClientResponse = await cognitoClient.send(
    new DescribeUserPoolClientCommand({
      UserPoolId: getUserPoolId(stack),
      ClientId: getUnScopedTestClientId(stack),
    }),
  );

  return UserPoolClient?.ClientSecret ?? '';
};

export const getStack = async (stackName: string): Promise<Stack> => {
  const cfn = new CloudFormationClient({ region });
  const stackResult = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Couldn't find stack with name ${stackName}`);
  }

  return stack;
};

export const getScopedTestToken = async (stack: Stack): Promise<AccessToken> => {
  const clientId = getScopedTestClientId(stack);
  const clientSecret = await getScopedTestClientSecret(stack);
  const userPoolDomain = getUserPoolDomain(stack);

  return getToken({ clientId, clientSecret, userPoolDomain });
};

export const getUnScopedTestToken = async (stack: Stack): Promise<AccessToken> => {
  const clientId = getUnScopedTestClientId(stack);
  const clientSecret = await getUnscopedTestClientSecret(stack);
  const userPoolDomain = getUserPoolDomain(stack);

  return getToken({ clientId, clientSecret, userPoolDomain });
};

const getToken = async (input: {
  clientId: string;
  clientSecret: string;
  userPoolDomain: string;
}) => {
  const { clientId, clientSecret, userPoolDomain } = input;
  const body = { grant_type: 'client_credentials' };
  const options: AxiosRequestConfig = {
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    baseURL: `https://${userPoolDomain}.auth.${region}.amazoncognito.com`,
  };
  const {
    data: { access_token: accessToken, expires_in: expiresIn, token_type: tokenType },
  } = await axios.post('/oauth2/token', qs.stringify(body), options);

  return { accessToken, expiresIn, tokenType };
};

interface AccessToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}
