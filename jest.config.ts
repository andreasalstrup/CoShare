import type {Config} from 'jest';

const config: Config = {
    preset: './jest-preset.ts',    
    transform: {
      '^.+\\.ts?$': 'ts-jest',
      '\\.[jt]sx?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['./setup-jest.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
      "uuid": require.resolve('uuid'),
    },
    transformIgnorePatterns: [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|webview-crypto|gun|uuid)"
    ],
    forceExit: true, // Gun keeps background workers running, which do not exit as of v0.2020.520.
  };
export default config