const CI = Boolean(process.env.CI || false);

module.exports = {
  preset: "jest-puppeteer",
  testEnvironment: "./test-environment.js",
  globalTeardown: "./global-teardown.js",
  forceExit: CI,
  testTimeout: CI ? 5000 : 20000
}