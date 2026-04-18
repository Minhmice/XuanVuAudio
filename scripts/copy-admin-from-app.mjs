import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

const pairs = [
  ["app/(auth)", "apps/admin/app/(auth)"],
  ["app/(internal)", "apps/admin/app/(internal)"],
];

for (const [relSrc, relDest] of pairs) {
  copyDir(path.join(root, relSrc), path.join(root, relDest));
}

const actionFiles = [
  "admin.ts",
  "auth.ts",
  "catalog.ts",
  "inventory.ts",
  "policy-pages.ts",
  "product-specs.ts",
  "products.ts",
  "showrooms.ts",
  "spec-attribute-definitions.ts",
  "article-categories.ts",
  "articles.ts",
];
fs.mkdirSync(path.join(root, "apps/admin/app/actions"), { recursive: true });
for (const f of actionFiles) {
  const src = path.join(root, "app/actions", f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(root, "apps/admin/app/actions", f));
  }
}

console.log("admin app tree copied from app/");
