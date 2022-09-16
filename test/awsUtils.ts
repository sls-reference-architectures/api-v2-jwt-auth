import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import faker from 'faker';
import { ulid } from 'ulid';

import { CreateTokenRequest } from '../src/models';

const createApiGatewayEvent = (payload: CreateTokenRequest): APIGatewayProxyEvent =>
  ({
    body: JSON.stringify(payload),
    headers: {},
  } as APIGatewayProxyEvent);

const createEmptyContext = (): Context => ({
  callbackWaitsForEmptyEventLoop: true,
  functionName: faker.internet.domainName(),
  functionVersion: faker.system.semver(),
  invokedFunctionArn: faker.lorem.slug(),
  memoryLimitInMB: '42MB',
  awsRequestId: `AWS-Test-${ulid()}`,
  logGroupName: faker.lorem.slug(),
  logStreamName: faker.lorem.slug(),
  done: emptyFunction,
  fail: emptyFunction,
  succeed: emptyFunction,
  getRemainingTimeInMillis: () => 42,
});

const emptyFunction = () => null;

export { createApiGatewayEvent, createEmptyContext };
