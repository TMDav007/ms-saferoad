/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  setupFilesAfterEnv: ["./src/tests/setup.ts"],
  testPathIgnorePatterns: ["build"]
};
