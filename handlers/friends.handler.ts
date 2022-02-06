import {
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequestStatus,
  getAllFriends,
  isFriendRequestExists,
  createFriendRequest,
  getFriendByOtherId,
  deleteFriend,
} from "../models/friends.model";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";

// const func = catchAsync(async (req,res) => {

// })

const acceptRequest = catchAsync(async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const status = await getFriendRequestStatus(requestId);
  if (status != "pending")
    throw new ApiError(httpStatus.BAD_REQUEST, "Request is not pending");
  const result = await acceptFriendRequest(requestId);
  res.send(result);
});

const rejectRequest = catchAsync(async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const status = await getFriendRequestStatus(requestId);
  if (status != "pending")
    throw new ApiError(httpStatus.BAD_REQUEST, "Request is not pending");
  const result = await rejectFriendRequest(requestId);
  res.send(result);
});

const sendFriendRequest = catchAsync(async (req, res) => {
  const { recieverId } = req.body;
  const senderId = req.id;
  if (!recieverId) throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const exists = await isFriendRequestExists(senderId, recieverId);
  if (exists)
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already exists");
  const result = await createFriendRequest(senderId, recieverId);
  res.status(httpStatus.OK).send({ status: "success", requestId: result });
});

const unFriendUser = catchAsync(async (req, res) => {
  const { otherId } = req.body;
  const userId = req.id;
  if (!otherId) throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const exists = await getFriendByOtherId(userId, otherId);
  if (!exists)
    throw new ApiError(httpStatus.BAD_REQUEST, "Friend request doesn't exist");
  if (!exists.active)
    throw new ApiError(httpStatus.BAD_REQUEST, "Friend request is not active");
  const result = await deleteFriend(userId, otherId);
  res.status(httpStatus.OK).send({ status: "success", friendshipId: result });
});

const getFriendsList = catchAsync(async (req, res) => {
  const userId = req.id;
  const friendsList = await getAllFriends(userId);
  res.status(200).send(friendsList);
});

export default {
  acceptRequest,
  rejectRequest,
  sendFriendRequest,
  getFriendsList,
  unFriendUser,
};
