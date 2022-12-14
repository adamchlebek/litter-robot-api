module.exports = {
    env: {
      jest: true,
      commonjs: true,
      es6: true,
      node: true
    },
    extends: [
      'standard'
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
      ecmaVersion: 2018
    },
    rules: {
      'semi': 0,
      'space-before-function-paren': 0
    }
  }
  Footer
  