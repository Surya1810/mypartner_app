import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    '**/*.md',
    '**/*.js',
    '**/*.yaml',
    '**/package.json',
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'unused-imports/no-unused-vars': 'off',
    'symbol-description': 'off',
    'node/prefer-global/process': 'off'
  },
})
