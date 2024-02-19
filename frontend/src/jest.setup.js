
// jest.setup.js
// Add any global setup, for example with jest-extended or enzyme, etc.

// Example of extending expect with jest-extended
require('jest-extended');

// Example of setting up enzyme with Adapter for React 16
// const Enzyme = require('enzyme');
// const Adapter = require('enzyme-adapter-react-16');

// Enzyme.configure({ adapter: new Adapter() });

// You can add any global setup you need for Jest here.
// jest.config.js
module.exports = {
    // ... other configurations
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest",
    },
  };
  