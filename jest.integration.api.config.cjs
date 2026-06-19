/** Jest + Supertest — integración API backend */
module.exports = {
  displayName: "integration-api",
  testEnvironment: "node",
  rootDir: ".",
  transform: {},
  setupFiles: ["<rootDir>/tests/setup/backend/env.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/backend/dbSetup.js"],
  testMatch: ["<rootDir>/tests/integration/api/**/*.test.js"],
  coverageDirectory: "<rootDir>/tests/reports/coverage/backend-integration",
  coverageReporters: ["text", "lcov", "html", "json"],
  collectCoverageFrom: [
    "backend/src/routes/**/*.js",
    "backend/src/controllers/**/*.js",
    "backend/src/middlewares/**/*.js",
    "!backend/src/server.js",
  ],
  modulePathIgnorePatterns: ["<rootDir>/backend/node_modules/"],
  moduleDirectories: ["node_modules", "<rootDir>/backend/node_modules"],
  testTimeout: 60000,
};
