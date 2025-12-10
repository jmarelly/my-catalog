import { config } from "./config";
import { app } from "./server";
import { initializeDatabase } from "./database";
import { seedAll } from "../scripts/seed";
import { logger } from "./utils/logger";

startServer();

async function startServer() {
  try {
    logger.info("🚀 Starting server...");

    initializeDatabase();
    await seedAll();

    app.listen(config.port, () => {
      logger.info({ port: config.port, env: config.env }, "✅ Server ready");
    });
  } catch (err) {
    logger.fatal(err, "💀 Failed to start server");
    process.exit(1);
  }
}
