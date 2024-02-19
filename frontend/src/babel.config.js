// babel.config.js
module.exports = {
  presets: [
    "@babel/preset-env"
    // Do not add "@babel/preset-react" if you want to leave the configuration as-is
  ],
  plugins: [
    "@babel/plugin-syntax-jsx" // Add this line to enable JSX parsing
    // ... any other plugins you are using
  ]
};
