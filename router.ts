import express from "express";
import userHandler from "./handlers/users.handler";
import friendsHandler from "./handlers/friends.handler";

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

router.get("/user/:id", userHandler.getUser);
router.post("/user/create", userHandler.createUser);
router.post("/user/login", userHandler.loginUser);

router.post("/user/friends/accept", friendsHandler.acceptRequest);
router.post("/user/friends/reject", friendsHandler.rejectRequest);
router.post("/user/friends/request", friendsHandler.sendFriendRequest);
router.get("/user/friends/all", friendsHandler.getFriendsList);

export default router;
