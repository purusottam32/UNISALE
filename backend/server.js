import "dotenv/config";
import { createServer } from "http";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import { initSocket } from "./src/socket/index.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);

    // Attach Socket.io to HTTP server
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`✓ UNISALE backend listening on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      httpServer.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
      setTimeout(() => {
        console.error("Forced shutdown after timeout.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error.message);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  process.exit(1);
});

startServer();
