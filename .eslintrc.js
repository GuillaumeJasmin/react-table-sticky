module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: ['airbnb'],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'typescript-sort-keys'],
  rules: {
    // @typescript-eslint
    '@typescript-eslint/no-unused-vars': [1, { ignoreRestSiblings: true }],
    '@typescript-eslint/member-delimiter-style': [1, {
      "multiline": {
        "delimiter": "semi",
        "requireLast": true
      },
      "singleline": {
        "delimiter": "semi",
        "requireLast": true
      },
    }],
    '@typescript-eslint/indent': [1, 2],
    'typescript-sort-keys/interface': 1,
    'import/prefer-default-export': 0,
    'max-len': [2, { code: 160 }],
    'no-console': [1, { allow: ['warn', 'error'] }],
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'arrow-body-style': 0,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.js', '.ts', '.tsx', '.json']
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {}
    }
  }
};
