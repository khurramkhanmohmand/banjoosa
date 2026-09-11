// Startup file for Hostinger's Node.js app hosting (Passenger), which runs
// `node <startup file>` directly and can't execute the "tsx" npm script.
// Registers tsx's require hook so the existing TypeScript entrypoint runs as-is.
require("tsx/cjs");
require("./src/server.ts");
