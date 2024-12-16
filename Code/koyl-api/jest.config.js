// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  automock: false,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // eslint-disable-next-line max-len
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'cobertura',
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx'],

  roots: ['./'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // eslint-disable-next-line max-len
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\', '<rootDir>/__tests__/setup/', 'dist/'],

  // eslint-disable-next-line max-len
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // jest-puppeteer set up
  preset: 'jest-puppeteer',
};
