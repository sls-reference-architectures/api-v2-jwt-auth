import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

const createApiGatewayEvent = (payload) => ({
  body: JSON.stringify(payload),
  headers: {},
});

const createEmptyContext = () => ({
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
