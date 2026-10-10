// Usage: node scripts/metrics/worker_size_sql.mjs <dry-run-output.txt> <project_name> <commit_sha>

import { readFileSync } from "node:fs";

const [file, projectName, sha] = process.argv.slice(2);
const text = readFileSync(file, "utf8");
const m = text.match(/Total Upload:\s*([\d.]+)\s*KiB\s*\/\s*gzip:\s*([\d.]+)\s*KiB/);
if (!m) {
  console.error("'Total Upload' not found on wrangler output");
  process.exit(1);
}

if (!/^[0-9a-f]{40}$/.test(sha)) {
  throw new Error(`Invalid commit sha: ${sha}`);
}

if (!/^[\w.-]{1,100}$/.test(projectName)) {
  throw new Error(`Invalid project name: ${projectName}`);
}

const kibToBytes = (s) => Math.round(Number(s) * 1024);
console.log("INSERT OR IGNORE INTO metric_samples (project_metric_id, timestamp, value, tag) VALUES");
console.log(`((SELECT p.id FROM project_metrics p JOIN metric_definitions m ON m.id = p.metric_definition_id WHERE p.project_name = '${projectName}' AND m.name = 'worker.size.uncompressed'), unixepoch(), ${kibToBytes(m[1])}, '${sha}'),`);
console.log(`((SELECT p.id FROM project_metrics p JOIN metric_definitions m ON m.id = p.metric_definition_id WHERE p.project_name = '${projectName}' AND m.name = 'worker.size.gzip'), unixepoch(), ${kibToBytes(m[2])}, '${sha}');`);
