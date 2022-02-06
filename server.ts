import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./router";
// import cron from "./utils/cron";
import { errorConverter, errorHandler } from "./middlewares/error";

const app = express();
const port = 4000;

declare global {
  namespace Express {
    interface Request {
      user: any;
      body: any;
    }
  }
}

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.use(errorConverter);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} `);
});
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("a user has connected");

  socket.on("message", (message) => {
    io.emit("message", `${message}`);
  });
});
