import { createServer } from "http";
import { createApp } from "./app";
import { initSocket } from "./lib/socket";
import { env } from "./config/env";

const app = createApp();
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(env.port, () => {
  console.log(`Banjoosa API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});
