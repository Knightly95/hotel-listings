#!/usr/bin/env node
// Fails the build when the JavaScript shipped to the browser grows past its
// budget. Sizes are gzip, as served.
// Usage: node scripts/bundle-budget.mjs <build dir> <budget in kB>
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const [dir, budgetArg] = process.argv.slice(2);
const budget = Number(budgetArg);
if (!dir || !budget) {
  console.error('Usage: bundle-budget.mjs <build dir> <budget in kB>');
  process.exit(1);
}

const files = [];
const walk = (path) => {
  for (const name of readdirSync(path)) {
    const full = join(path, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.js')) files.push(full);
  }
};
walk(dir);

const kB = (bytes) => Math.round((bytes / 1024) * 10) / 10;
const sizes = files
  .map((file) => ({ file: relative(dir, file), gzip: gzipSync(readFileSync(file)).length }))
  .sort((a, b) => b.gzip - a.gzip);
const total = kB(sizes.reduce((sum, { gzip }) => sum + gzip, 0));

for (const { file, gzip } of sizes.slice(0, 5)) console.log(`${String(kB(gzip)).padStart(8)} kB  ${file}`);
console.log(`JavaScript total: ${total} kB gzip (${files.length} files), budget ${budget} kB`);
if (total > budget) {
  console.error(`Over budget by ${kB((total - budget) * 1024)} kB.`);
  process.exit(1);
}
