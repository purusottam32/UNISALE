import "dotenv/config";
import { createServer } from "http";
import app from "./src/app.js";
import config from "./src/config/index.js";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/index.js";

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(config.port, () => {
      console.log(`[api] UniSale backend listening on port ${config.port}`);
      console.log(`[api] environment: ${config.env}`);
      console.log(`[api] docs: http://localhost:${config.port}/api/docs`);
    });

    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      httpServer.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
      setTimeout(() => {
        console.error("Forced shutdown after timeout.");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error?.message || error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error?.message || error);
  process.exit(1);
});

startServer();
