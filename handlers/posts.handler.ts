import { makeNewPost, getAllPostsByUserId } from "../models/posts.model";
import { getAllFriendsIds } from "../models/friends.model";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import moment from "moment";
import httpStatus from "http-status";

// const func = catchAsync(async (req, res) => {});
const makePost = catchAsync(async (req, res) => {
  const userid = req.id;
  const { postContent, postTitle } = req.body;
  if (!postContent || !postTitle)
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing data");
  const result = await makeNewPost({
    userid,
    post_content: postContent,
    post_title: postTitle,
  });
  res.status(httpStatus.OK).send({ success: true, result });
});

const getAllPosts = catchAsync(async (req, res) => {
  const userid = req.id;
  const { amount } = req.body;
  const ids = await getAllFriendsIds(userid);
  let posts = [];
  let count = 0;
  for (let i = 0; i < ids.length; i++) {
    if (count == amount) break;
    (await getAllPostsByUserId(ids[i].userid_1)).map(
      (post: { post_title: string; post_content: string }) => {
        posts.push(post);
      }
    );
  }
  res.status(httpStatus.OK).send({ success: true, posts });
});
export default { makePost, getAllPosts };
