module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:promise/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
    'promise'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Indentation with 2 spaces
    indent: ['error', 2],
    // No trailing spaces
    'no-trailing-spaces': 'error',
    // Semicolons required
    semi: ['error', 'always'],
    // Single quotes for strings
    quotes: ['error', 'single'],
    // Console logs warning (not error, to allow during development)
    'no-console': 'warn',
    // Require === instead of ==
    eqeqeq: 'error',
    // Enforce consistent spacing inside braces
    'object-curly-spacing': ['error', 'always'],
    // Enforce consistent line breaks
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, consistent: true },
      ObjectPattern: { multiline: true, consistent: true }
    }],
    // React specific rules
    'react/prop-types': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // Import rules
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true }
    }]
  }
};
