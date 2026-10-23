module.exports = {
  browsers: ['chrome:headless'],
  src: ['tests/e2e'],
  appCommand: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
  appInitDelay: 3000,
  compilerOptions: {
    typescript: {
      // TestCafé's bundled TypeScript is too old for the current @types/node
      customCompilerModulePath: require.resolve('typescript'),
      options: { ignoreDeprecations: '6.0' },
    },
  },
};
