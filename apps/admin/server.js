// Startup file for Hostinger's Node.js app hosting (Passenger), which runs
// `node <startup file>` directly rather than an npm script. Standard custom
// server pattern from Next.js docs for that kind of host.
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3001;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Banjoosa admin listening on port ${port}`);
  });
});
