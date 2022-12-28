module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@/middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '@/utils/(.*)': '<rootDir>/src/utils/$1',
    '@/resources/(.*)': '<rootDir>/src/resources/$1',
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
};
