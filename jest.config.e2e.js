module.exports = {
  ...require('./jest.config'),
  globalSetup: './test/jest.setup.js',
  testTimeout: 60000,
};
