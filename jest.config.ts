import type { Config } from 'jest'

const config: Config = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testEnvironment: 'node',
    testTimeout: 10000,
    testRegex: '.*(.spec|.ispec).ts',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    roots: ['<rootDir>/src/'],
    modulePaths: ['<rootDir>'],
    maxConcurrency: 10,
    maxWorkers: 5,
}

export default config