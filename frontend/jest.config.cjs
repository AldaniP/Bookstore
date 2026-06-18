module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$": "<rootDir>/__mocks__/fileMock.js",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  injectGlobals: true
};
