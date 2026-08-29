import js from '@eslint/js'

export default [
  {
    ignores: [
      'browser-source-map-support.js',
      'coverage/**',
      'node_modules/**',
      'release-candidate/**',
      'site-dist/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        AbortController: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        TextDecoder: 'readonly',
        Uint8Array: 'readonly',
        XMLHttpRequest: 'readonly',
        __dirname: 'readonly',
        atob: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        decodeURIComponent: 'readonly',
        document: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        globalThis: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly'
      }
    },
    rules: {
      'no-cond-assign': ['error', 'except-parens'],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }]
    }
  },
  {
    files: ['source-map-support.js', 'register.js', 'register-hook-require.js', 'test/upstream.test.cjs'],
    rules: {
      'no-cond-assign': 'off',
      'no-constant-condition': 'off',
      'no-empty': 'off',
      'no-prototype-builtins': 'off',
      'no-regex-spaces': 'off',
      'no-useless-escape': 'off',
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['test/upstream.test.cjs'],
    languageOptions: {
      globals: { it: 'readonly' }
    }
  }
]
