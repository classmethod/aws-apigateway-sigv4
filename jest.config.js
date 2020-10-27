module.exports = {
    roots: ['<rootDir>'],
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
