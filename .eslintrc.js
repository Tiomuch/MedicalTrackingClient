module.exports = {
  root: true,
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['prettier', '@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  },
  env: {
    node: true,
    es2021: true
  },
  rules: {
    'sort-imports': [
      'error',
      { ignoreCase: true, ignoreDeclarationSort: true }
    ],
    'import/order': [
      'error',
      {
        groups: [
          ['external', 'builtin'],
          'internal',
          ['sibling', 'parent'],
          'index'
        ],
        pathGroups: [
          {
            pattern: '@(react|react-native)',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@screens/**',
            group: 'internal'
          },
          {
            pattern: '@components/**',
            group: 'internal'
          },
          {
            pattern: '@navigation/**',
            group: 'internal'
          },
          {
            pattern: '@utils/**',
            group: 'internal'
          },
          {
            pattern: '@api/**',
            group: 'internal'
          },
          {
            pattern: '@store/**',
            group: 'internal'
          }
        ],
        pathGroupsExcludedImportTypes: ['internal', 'react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  }
}
