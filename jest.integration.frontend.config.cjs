/** Jest + MSW — integración frontend (servicios API) */
module.exports = {
  displayName: "integration-frontend",
  testEnvironment: "node",
  rootDir: ".",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/frontend/setupIntegration.js"],
  testMatch: ["<rootDir>/tests/integration/frontend/**/*.test.js"],
  transform: { "^.+\\.(js|jsx)$": "babel-jest" },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  moduleDirectories: ["node_modules", "<rootDir>/frontend/node_modules"],
  coverageDirectory: "<rootDir>/tests/reports/coverage/frontend-integration",
  coverageReporters: ["text", "lcov", "html", "json"],
  collectCoverageFrom: ["frontend/src/services/**/*.js", "frontend/src/config/**/*.js"],
  testTimeout: 15000,
};
