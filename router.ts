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

router.post("/room/send", checkAuth, roomsHandler.postMessageToRoom);
router.post(
  "/room/all-messages-by-other",
  checkAuth,
  roomsHandler.getAllRoomMessages
);
router.post(
  "/room/all-messages",
  checkAuth,
  roomsHandler.getRoomMessagesByRoomId
);
router.post("/room/create", checkAuth, roomsHandler.createNewRoom);
router.post(
  "/room/all-participants",
  checkAuth,
  roomsHandler.getAllRoomParticipants
);
router.post("/room/check", checkAuth, roomsHandler.checkIfParticipantsOfRoom);
router.post("/room/add", roomsHandler.addParticipantToRoom);

export default router;
