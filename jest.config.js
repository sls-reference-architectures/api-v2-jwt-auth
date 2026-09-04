const esModules = ['@faker-js/faker'];

module.exports = {
  transform: {
    '^.+\\.jsx?$': '@swc/jest',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
};
