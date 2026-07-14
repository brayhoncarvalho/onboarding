import tsParser from '@typescript-eslint/parser';
import pluginVue from 'eslint-plugin-vue';

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Desabilitar regras conflitantes com o projeto
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',

      // Regras de qualidade de componentes
      'vue/require-v-for-key': 'error',
      'vue/no-unused-vars': 'warn',
      'vue/no-mutating-props': 'error',

      // Acessibilidade básica
      'vue/html-self-closing': ['warn', {
        html: { void: 'always', normal: 'never', component: 'always' },
      }],
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.js'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
];
