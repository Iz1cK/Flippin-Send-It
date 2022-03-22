import {
  addMessageToRoom,
  addUserToRoom,
  isUserAParticipantOfRoom,
  getAllMessagesFromRoom,
  getRoomByParticipant,
  addNewRoom,
  isRoomExists,
  getRoomParticipants,
} from "../models/rooms.model";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";

const postMessageToRoom = catchAsync(async (req, res) => {
  const userId = req.id;
  const { roomId, message } = req.body;
  console.log("userid:" + userId);
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

const getRoomMessagesByRoomId = catchAsync(async (req, res) => {
  const userId = req.id;
  const { roomId } = req.body;
  console.log(userId);
  if (!roomId)
    throw new ApiError(httpStatus.BAD_REQUEST, "No existing room for this id");
  if (!(await isUserAParticipantOfRoom(userId, roomId)))
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User isn't a participant of room"
    );
  const result = await getAllMessagesFromRoom(roomId);
  res.status(httpStatus.OK).send({ status: "success", messages: result });
});

const createNewRoom = catchAsync(async (req, res) => {
  const userId = req.id;
  const { otherId, name } = req.body;
  if (!otherId || !name)
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const roomId = await addNewRoom(name);
  const result1 = await addUserToRoom(userId, roomId);
  const result2 = await addUserToRoom(otherId, roomId);
  res
    .status(httpStatus.OK)
    .send({ status: "success", roomId: roomId, results: [result1, result2] });
});

const checkIfParticipantsOfRoom = catchAsync(async (req, res) => {
  const { participants, roomId } = req.body;
  if (participants.length === 0 || !roomId)
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  let access = true;
  for (let i = 0; i < participants.length; i++) {
    const participant = participants[i];
    access = access && (await isUserAParticipantOfRoom(+participant, roomId));
  }
  res.status(200).send({ status: "success", result: access });
});

const getAllRoomParticipants = catchAsync(async (req, res) => {
  const userId = req.id;
  const { roomId } = req.body;
  console.log("userid:" + userId);
  if (!roomId) throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const result = await getRoomParticipants(roomId);
  res.status(200).send({ status: "success", result: result, userId: userId });
});

const addParticipantToRoom = catchAsync(async (req, res) => {
  const { participant, roomId } = req.body;
  if (!participant || !roomId)
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const result = await addUserToRoom(participant, roomId);
  res.status(200).send({ status: "success", result: result });
});

export default {
  postMessageToRoom,
  getAllRoomMessages,
  createNewRoom,
  checkIfParticipantsOfRoom,
  getAllRoomParticipants,
  getRoomMessagesByRoomId,
  addParticipantToRoom,
};
