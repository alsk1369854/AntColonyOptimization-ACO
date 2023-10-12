/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    coverageDirectory: "coverage",
    preset: 'ts-jest',
    testEnvironment: "node",
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
    coverageReporters: [['text', { skipFull: true }], "lcov", "json-summary"]
};