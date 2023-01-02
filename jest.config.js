const { defaults } = require("jest-config");

const config = {
	...defaults,
	runTestsByPath: true,
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

module.exports = config;
