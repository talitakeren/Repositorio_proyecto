/** Jest — pruebas unitarias backend */
module.exports = {
  displayName: "unit-backend",
  testEnvironment: "node",
  rootDir: ".",
  transform: {},
  setupFiles: ["<rootDir>/tests/setup/backend/env.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/backend/dbSetup.js"],
  testMatch: ["<rootDir>/tests/unit/backend/**/*.test.js"],
  coverageDirectory: "<rootDir>/tests/reports/coverage/backend-unit",
  coverageReporters: ["text", "lcov", "html", "json"],
  collectCoverageFrom: [
    "backend/src/services/**/*.js",
    "backend/src/middlewares/**/*.js",
    "backend/src/utils/**/*.js",
    "backend/src/controllers/**/*.js",
    "!backend/src/server.js",
    "!backend/src/seed/**",
  ],
  modulePathIgnorePatterns: ["<rootDir>/backend/node_modules/"],
  moduleDirectories: ["node_modules", "<rootDir>/backend/node_modules"],
  testTimeout: 30000,
};
