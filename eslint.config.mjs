import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'prisma/migrations/**',
      'public/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Disable rules that conflict with Prettier (Prettier owns formatting).
  eslintConfigPrettier,
  {
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      // Deliberate: images are served via Cloudinary/local paths, not next/image.
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
