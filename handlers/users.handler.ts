import {
  getUserByUsername,
  getUserById,
  addUser,
  getUserByEmail,
  verifyUserById,
} from "../models/users.model";
import sendMail from "../utils/Mailer";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

const getUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = await getUserById(id);

  res.status(201).send(data);
});

const createUser = catchAsync(async (req, res) => {
  const { username, password, email, firstname, lastname, age, gender } =
    req.body;

  if (
    !username ||
    !password ||
    !email ||
    !firstname ||
    !lastname ||
    !age ||
    !gender
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing data!");
  }

  const exists =
    !!(await getUserByUsername(username)) || !!(await getUserByEmail(email));
  if (exists) throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = {
    username,
    password: hash,
    email,
    firstname,
    lastname,
    age,
    gender,
  };

  const userId = await addUser(user);

  const verificationId = jwt.sign(userId, SECRET);

  const mailOptions = {
    from: `Flippin Send It <flippinsenditnoreply@gmail.com>`,
    to: `${email}`,
    subject: "Flippin Send It Verification Email",
    html: `
            <h2>Please visit the website <a href="http://localhost:3000/verify?q=${verificationId}">To Verify</a> your account</h2>
           `,
  };

  sendMail(mailOptions);

  res.status(httpStatus.OK).send({ userid: userId, status: "success" });
});

const loginUser = catchAsync(async (req, res) => {
  const { username, password, email } = req.body;
  if ((!username && !email) || !password)
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing data!");
  const exists =
    (await getUserByUsername(username)) || (await getUserByEmail(email));
  if (!exists) throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist");
  const dbPassword = exists.password;

  const match = bcrypt.compareSync(password, dbPassword);
  if (!match) throw new ApiError(401, "Wrong password");
  const token = jwt.sign({ username: exists.username, id: exists.id }, SECRET);
  const response = {
    username: exists.username,
    access_token: token,
    success: true,
  };
  res.status(200).send(response);
});

const verifyUser = catchAsync(async (req, res) => {
  const userid = req.params.userid;
  const id = jwt.verify(userid, SECRET);

  const check = await verifyUserById(id);
  if (!check)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Couldn't verify account"
    );
  const response = {
    success: true,
    check: check,
  };
  res.status(200).send(response);
});

export default {
  getUser,
  createUser,
  loginUser,
  verifyUser,
};
