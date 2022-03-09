import express from "express";
import userHandler from "./handlers/users.handler";
import friendsHandler from "./handlers/friends.handler";
import roomsHandler from "./handlers/rooms.handler";
import checkAuth from "./middlewares/checkAuth";

const router = express.Router();

router.get("/user/:id", userHandler.getUser);
router.get("/user", checkAuth, userHandler.getCurrentUser);
router.get("/user/account/verify/:userid", userHandler.verifyUser);
router.post("/user/create", userHandler.createUser);
router.post("/user/login", userHandler.loginUser);

router.post("/user/friends/accept", checkAuth, friendsHandler.acceptRequest);
router.post("/user/friends/reject", checkAuth, friendsHandler.rejectRequest);
router.post(
  "/user/friends/request",
  checkAuth,
  friendsHandler.sendFriendRequest
);
router.post("/user/friends/delete", checkAuth, friendsHandler.unFriendUser);
router.get("/user/friends/all", checkAuth, friendsHandler.getFriendsList);

router.post("/user/room/send", checkAuth, roomsHandler.postMessageToRoom);
router.post(
  "/user/room/allMessages",
  checkAuth,
  roomsHandler.getAllRoomMessages
);
router.post("/user/room/create", checkAuth, roomsHandler.createNewRoom);
router.post(
  "/user/room/allParticipants",
  checkAuth,
  roomsHandler.getAllRoomParticipants
);
router.post(
  "/user/room/check",
  checkAuth,
  roomsHandler.checkIfParticipantsOfRoom
);

export default router;
