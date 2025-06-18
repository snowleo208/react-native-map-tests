module.exports = {
    preset: 'jest-expo',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native' +
        '|expo-modules-core' +
        '|expo' +
        '|@expo' +
        '|react-native-maps' +
        '|@react-native' +
        '|@react-navigation' +
        ')/)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
