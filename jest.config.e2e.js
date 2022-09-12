/* eslint-disable global-require */
module.exports = {
  ...require('./jest.config'),
  globalSetup: './test/jest.setup.ts',
  testTimeout: 60000,
};
