module.exports = {
    testMatch: [
      // '<rootDir>/src/**/*.test.js',
      '<rootDir>/.test.jsx',
    ],
    setupFiles: ['<rootDir>/jest.setup.js'], // Example: You can specify setup files
    moduleNameMapper: {
      // Example: Map module imports to mock files
      '^@/(.*)$': '<rootDir>/$1',
    },
    // Other Jest configuration options
  };