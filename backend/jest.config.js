module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "src/modules/**/*.ts",
    "src/utils/**/*.ts",
    "!src/**/*.model.ts",
    "!src/**/*.route.ts",
    "!src/**/*.validations.ts",
    "!src/index.ts",
    "!src/seed.ts",
  ],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  setupFilesAfterEnv: ["<rootDir>/src/config/setupTests.ts"],
};
