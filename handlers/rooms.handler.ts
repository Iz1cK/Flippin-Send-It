import {
  addMessageToRoom,
  addUserToRoom,
  isUserAParticipantOfRoom,
  getAllMessagesFromRoom,
  getRoomByParticipant,
  addNewRoom,
  isRoomExists,
} from "../models/rooms.model";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";

const postMessageToRoom = catchAsync(async (req, res) => {
  const userId = req.id;
  const { roomId, message } = req.body;
  if (!roomId || !message)
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  if (!(await isRoomExists(roomId)))
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid roomId");
  if (!(await isUserAParticipantOfRoom(userId, roomId)))
    throw new ApiError(httpStatus.BAD_REQUEST, "User isn't part of the room");
  const result = await addMessageToRoom(userId, roomId, message);
  res.status(httpStatus.OK).send({ status: "success", messageId: result });
});

const getAllRoomMessages = catchAsync(async (req, res) => {
  const userId = req.id;
  const { otherId } = req.body;
  if (!otherId) throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const roomId = await getRoomByParticipant(userId, otherId);
  if (!roomId)
    throw new ApiError(httpStatus.BAD_REQUEST, "No existing room for this id");
  const result = await getAllMessagesFromRoom(roomId);
  res.status(httpStatus.OK).send({ status: "success", messages: result });
});

const createNewRoom = catchAsync(async (req, res) => {
  const userId = req.id;
  const { otherId, name } = req.body;
  if (!otherId) throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const roomId = await addNewRoom(name);
  const result1 = await addUserToRoom(userId, roomId);
  const result2 = await addUserToRoom(otherId, roomId);
  res
    .status(httpStatus.OK)
    .send({ status: "success", roomId: roomId, results: [result1, result2] });
});

export default {
  postMessageToRoom,
  getAllRoomMessages,
  createNewRoom,
};
