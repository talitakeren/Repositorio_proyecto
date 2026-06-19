import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    downloadsFolder: "cypress/downloads",
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 12000,
    env: {
      API_URL: "http://localhost:5001/api",
    },
  },
});
