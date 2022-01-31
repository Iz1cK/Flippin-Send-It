import express from "express";
import userHandler from "./handlers/users.handler";

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

router.get("/user/:id", userHandler.getUser);

export default router;
