#!/usr/bin/env node
// Turns the coverage summary into the JSON that a shields.io "endpoint" badge
// reads. Usage: node scripts/coverage-badge.mjs <coverage-summary.json> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';

const [summaryPath, outPath] = process.argv.slice(2);
if (!summaryPath || !outPath) {
  console.error('Usage: coverage-badge.js <coverage-summary.json> <out.json>');
  process.exit(1);
}

const lines = JSON.parse(readFileSync(summaryPath, 'utf8')).total.lines.pct;

let color = 'red';
if (lines >= 90) color = 'brightgreen';
else if (lines >= 80) color = 'green';
else if (lines >= 70) color = 'yellow';

writeFileSync(
  outPath,
  JSON.stringify({ schemaVersion: 1, label: 'coverage', message: `${lines}%`, color }),
);
console.log(`Line coverage: ${lines}%`);
