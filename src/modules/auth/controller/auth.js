import { nanoid } from "nanoid";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import sendEmail from "../../../utils/SendEmail.js";

const randomId = nanoid();

export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, key } = req.body;
  const User = await userModel.findOne({ email: email.toLowerCase() });
  if (!User) {
    const confirmToken = generateToken({
      payload: { email, userName },
      signature: process.env.EMAIL_TOKEN_SIGNATURE,
      expiresIn: 60 * 5,
    });
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${confirmToken}`;
    const confirmRefreshToken = generateToken({
      payload: { email, userName },
      signature: process.env.EMAIL_TOKEN_SIGNATURE,
      expiresIn: 60 * 60 * 24 * 30,
    });
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${confirmRefreshToken}`;
    const html = `<a href="${link}">Click Here To Confirm Email</a>
    <br/>
    <br/>
    <a href="${refreshLink}">Request New Email</a>`;
    if (!(await sendEmail({ to: email, subject: "Confirm Email", html }))) {
      return next(new Error("Rejected email", { cause: 400 }));
    }
    const hashPassword = hash({ plainText: password });
    const createUser = await userModel.create({
      userName,
      email,
      password: hashPassword,
    });
    if (key && key === "ADMIN_2023") {
      createUser.role = "Admin";
      await createUser.save();
      const token = generateToken({
        payload: {
          _id: createUser._id,
          role: createUser.role,
          userName: userName.substring(6),
          email,
        },
        signature: process.env.EMAIL_TOKEN_SIGNATURE,
        expiresIn: 60 * 5,
      });
      return res.status(201).json({ message: "Done", token });
    } else {
      const token = generateToken({
        payload: {
          _id: createUser._id,
          role: createUser.role,
          userName,
          email,
        },
        signature: process.env.EMAIL_TOKEN_SIGNATURE,
        expiresIn: 60 * 5,
      });
      return res.status(201).json({ message: "Done", token });
    }
  }
  return next(new Error("Email exists", { cause: 409 }));
});

export const confirmEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
  });
  const User = await userModel.updateOne(
    { email: email.toLowerCase() },
    { confirmEmail: true }
  );
  return User.modifiedCount
    ? res
        .status(200)
        .redirect(`${process.env.CLIENT}/email-confirmation/${randomId}`)
    : res.status(404).send("Account not registered");
});

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
  });
  const newToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 2,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;
  const html = `<a href="${link}">Click Here To Confirm Email</a> 
  <br/> 
  <br/> 
  <a href="${refreshLink}">Request New Email</a>`;
  if (!(await sendEmail({ to: email, subject: "Confirm Email", html }))) {
    return next(new Error("Rejected email", { cause: 400 }));
  }
  return res
    .status(200)
    .redirect(`${process.env.CLIENT}/check-email/${randomId}`);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const User = await userModel.findOne({ email: email.toLowerCase() });
  if (!User) {
    return next(new Error("Email isn't exist", { cause: 404 }));
  }
  if (User.isBlocked) {
    return next(new Error("Account is blocked", { cause: 404 }));
  }
  if (!User.confirmEmail) {
    return next(new Error("Please! confirm your email", { cause: 400 }));
  }
  const match = compare({ plainText: password, hashValue: User.password });
  if (!match) {
    return next(new Error("In-valid password", { cause: 400 }));
  }
  const token = generateToken({
    payload: {
      _id: User._id,
      role: User.role,
      userName: User.userName,
      email,
    },
    expiresIn: 60 * 60 * 24,
  });
  const refreshToken = generateToken({
    payload: {
      _id: User._id,
      isLoggedIn: true,
      role: User.role,
      userName: User.userName,
      email,
    },
    expiresIn: 60 * 60 * 24 * 365,
  });
  User.userStatus = "online";
  await User.save();
  return res.status(200).json({ message: "Done", token, refreshToken });
});
