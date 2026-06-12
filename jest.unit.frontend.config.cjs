/** Jest + RTL — pruebas unitarias frontend (componentes y utils) */
module.exports = {
  displayName: "unit-frontend",
  testEnvironment: "jsdom",
  rootDir: ".",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/frontend/setupUnit.cjs"],
  testMatch: ["<rootDir>/tests/unit/frontend/**/*.test.{js,jsx}"],
  transform: { "^.+\\.(js|jsx)$": "babel-jest" },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^lucide-react$": "<rootDir>/tests/mocks/lucide-react.jsx",
  },
  moduleDirectories: ["node_modules", "<rootDir>/frontend/node_modules"],
  coverageDirectory: "<rootDir>/tests/reports/coverage/frontend-unit",
  coverageReporters: ["text", "lcov", "html", "json"],
  collectCoverageFrom: [
    "frontend/src/components/**/*.{js,jsx}",
    "frontend/src/utils/**/*.{js,jsx}",
    "frontend/src/hooks/**/*.{js,jsx}",
    "!frontend/src/main.jsx",
  ],
  testTimeout: 15000,
};
