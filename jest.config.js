module.exports = {
  testIgnorePatterns: ["/node_modules/", "/.next/"], // ignora essas pastas para os testes
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setUpTests.ts"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
};