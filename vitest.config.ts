import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "server-only",
        replacement: path.join(root, "tests/mocks/server-only.ts"),
      },
      {
        find: /^@xuanvu\/shared\/(.+)$/,
        replacement: path.join(root, "packages/shared/src/$1"),
      },
      {
        find: /^@\/app\/lib\/(.+)$/,
        replacement: path.join(root, "packages/shared/src/$1"),
      },
      {
        find: /^@\/app\/actions\/(.+)$/,
        replacement: path.join(root, "apps/admin/app/actions/$1"),
      },
      {
        find: /^@\/app\/\(internal\)\/(.+)$/,
        replacement: path.join(root, "apps/admin/app/(internal)/$1"),
      },
      {
        find: /^@\/app\/\(auth\)\/(.+)$/,
        replacement: path.join(root, "apps/admin/app/(auth)/$1"),
      },
      {
        find: /^@\/components\/storefront\/(.+)$/,
        replacement: path.join(root, "apps/web/src/components/storefront/$1"),
      },
      {
        find: /^@\/components\/wrapper\/(.+)$/,
        replacement: path.join(root, "apps/web/src/components/wrapper/$1"),
      },
      {
        find: /^@\/components\/layout\/(.+)$/,
        replacement: path.join(root, "apps/web/src/components/layout/$1"),
      },
      {
        find: /^@\/components\/ui\/(.+)$/,
        replacement: path.join(root, "apps/web/src/components/ui/$1"),
      },
      {
        find: /^@\/infrastructure\/(.+)$/,
        replacement: path.join(root, "apps/web/src/infrastructure/$1"),
      },
      {
        find: /^@\/config\/(.+)$/,
        replacement: path.join(root, "apps/web/src/config/$1"),
      },
      {
        find: /^@\/hooks\/(.+)$/,
        replacement: path.join(root, "apps/web/src/hooks/$1"),
      },
      {
        find: /^@\/styles\/(.+)$/,
        replacement: path.join(root, "apps/web/src/styles/$1"),
      },
      {
        find: /^@\/lib\/(.+)$/,
        replacement: path.join(root, "apps/web/src/lib/$1"),
      },
      {
        find: /^@\/types$/,
        replacement: path.join(root, "apps/web/src/types/index.ts"),
      },
      {
        find: /^@\/types\/(.+)$/,
        replacement: path.join(root, "apps/web/src/types/$1"),
      },
      {
        find: /^@\/components\/admin\/(.+)$/,
        replacement: path.join(root, "apps/admin/components/admin/$1"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
