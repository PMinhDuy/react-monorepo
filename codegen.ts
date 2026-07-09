import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  // Use the local schema file from the backend project.
  // Run the backend with `nest start` to regenerate schema.gql if needed.
  schema: '../nestjs-graphql-starter/src/schema.gql',
  // All GraphQL operations are centralized here — do NOT add gql`` inline in components.
  documents: ['libs/shared/graphql/src/lib/graphql/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'libs/shared/graphql/src/lib/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        scalars: { DateTime: 'string' },
        enumsAsTypes: true,
      },
    },
  },
}

export default config

