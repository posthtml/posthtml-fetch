module.exports = {
  space: true,
  rules: {
    semi: 0,
    'comma-dangle': 0,
    'arrow-body-style': 0,
    'unicorn/prefer-spread': 0,
    'unicorn/string-content': 0,
    'unicorn/no-array-for-each': 0,
    'promise/prefer-await-to-then': 0,
    'unicorn/no-abusive-eslint-disable': 0,
    quotes: ['error', 'single', {allowTemplateLiterals: true}],
    'import/extensions': ['error', 'ignorePackages', {
      '': 'never',
    }],
  }
}
