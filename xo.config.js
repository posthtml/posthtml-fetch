module.exports = {
  fix: true,
  space: true,
  rules: {
    semi: 0,
    'unicorn/prefer-spread': 0,
    'unicorn/string-content': 0,
    'promise/prefer-await-to-then': 0,
    'unicorn/no-abusive-eslint-disable': 0,
    'unicorn/prefer-module': 0,
    quotes: ['error', 'single', {allowTemplateLiterals: true}],
    'import/extensions': ['error', 'ignorePackages', {
      '': 'never',
    }],
  },
};
