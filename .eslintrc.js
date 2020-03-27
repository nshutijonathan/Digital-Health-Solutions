module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'one-var': 1,
    'one-var-declaration-per-line': 1,
    'new-cap': 1,
    'consistent-return': 1,
    'no-param-reassign': 1,
    'comma-dangle': 0,
    curly: ['error', 'multi-line'],
    'import/no-unresolved': [2, { commonjs: true }],
    'no-shadow': ['error', { allow: ['req', 'res', 'err'] }],
    'valid-jsdoc': [
      'error',
      {
        requireReturn: true,
        requireReturnType: true,
        requireParamDescription: false,
        requireReturnDescription: true
      }
    ],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true
        }
      }
    ]
  }
};
