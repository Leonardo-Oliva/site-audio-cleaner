const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy", // Mapeia estilos para um objeto falso
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js", // Mapeia outros estilos como mocks
  },
};

module.exports = createJestConfig(customJestConfig);
