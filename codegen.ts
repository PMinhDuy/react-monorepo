import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/graphql',
  documents: ['apps/*/src/**/*.{ts,tsx}', 'libs/*/src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    'libs/shared/graphql/src/lib/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        scalars: { DateTime: 'string' },
      },
    },
  },
}

export default config
