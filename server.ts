import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import * as dotenv from "dotenv";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-screen", (screenId) => {
      socket.join(`screen:${screenId}`);
      console.log(`Socket ${socket.id} joined screen:${screenId}`);
    });

    socket.on("join-admin", () => {
      socket.join("admin");
      console.log(`Socket ${socket.id} joined admin room`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Attach io to the global object so we can use it in API routes
  (global as any).io = io;

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
