// jest.config.js
module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
  
    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  
    // The test environment that will be used for testing
    testEnvironment: "jsdom", // make sure this is set to "jsdom" for React testing
  
    // The glob patterns Jest uses to detect test files
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
  
    // The paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ['<rootDir>/path/to/your/jest.setup.js'], // Adjust if you have a global setup file
  
    // The pattern or patterns Jest uses to detect test files
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.([tj]sx?)$',
  
    // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
    testURL: "http://localhost",
  
    // A map from regular expressions to paths to transformers
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
  
    // Indicates whether each individual test should be reported during the run
    verbose: true,
  };
  