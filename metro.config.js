const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blacklistRE = /.*\/__(mocks|tests)__\/.*/;

module.exports = config;
