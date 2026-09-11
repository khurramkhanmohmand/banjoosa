// esbuild bundles @prisma/client's JS inline, but its generated query engine
// binary can't be bundled — the bundled code looks it up next to itself via
// __dirname at runtime, so copy whatever engine binary "prisma generate" just
// produced into dist/ alongside server.js. Node_modules location varies
// (hoisted to the monorepo root normally, local to apps/api on a host that
// installs it standalone), so check both.
const fs = require("fs");
const path = require("path");

const candidates = [
  path.join(__dirname, "..", "node_modules", ".prisma", "client"),
  path.join(__dirname, "..", "..", "..", "node_modules", ".prisma", "client"),
];

const distDir = path.join(__dirname, "..", "dist");
fs.mkdirSync(distDir, { recursive: true });

let copied = 0;
for (const dir of candidates) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".node")) {
      fs.copyFileSync(path.join(dir, file), path.join(distDir, file));
      copied++;
      console.log(`Copied Prisma engine binary: ${file}`);
    }
  }
}

if (copied === 0) {
  console.error("No Prisma query engine binary found to copy into dist/ — check that 'prisma generate' ran first.");
  process.exit(1);
}
