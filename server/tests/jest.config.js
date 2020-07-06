module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
