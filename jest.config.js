module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // ignora essas pastas para os testes
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setUpTests.ts"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.test.tsx",
    "!src/**/*._app.tsx",
    "!src/**/*._document.tsx",
  ],
  coverageReporters: ["lcov", "json"],
};