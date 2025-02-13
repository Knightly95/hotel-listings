import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import { TextDecoder, TextEncoder } from 'util';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ["<rootDir>/setupTests.tsx"],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder,
  },
  
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)