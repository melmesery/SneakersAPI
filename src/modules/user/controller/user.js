import moment from "moment";
import { asyncHandler } from "../../../utils/ErrorHandling.js";
import userModel from "../../../../DB/model/User.model.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";

export const stats = asyncHandler(async (_, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD hh:mm:ss");
  const users = await userModel
    .aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ])
    .sort({ _id: -1 });
  return res.status(200).send(users);
});

export const getAllUsers = asyncHandler(async (_, res, next) => {
  const users = await userModel.find().sort({ _id: -1 }).select("-password");
  if (users.length === 0) {
    return next(new Error("No users found", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", users });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).select("-password");
  if (!user) {
    return next(new Error("No user found", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", user });
});

export const blockUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.params.id });
  if (user) {
    user.isBlocked = !user.isBlocked;
    await user.save();
    return res.status(200).json({ message: "Done", user });
  }
  return next(new Error("No user found", { cause: 400 }));
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.params.id });
  if (!user) {
    return next(new Error("No user found", { cause: 400 }));
  }
  if (req.body.newPassword) {
    const match = compare({
      plainText: req.body.oldPassword,
      hashValue: user.password,
    });
    if (!match) {
      return next(new Error("Wrong Password", { cause: 401 }));
    }
    const hashPassword = hash({ plainText: req.body.newPassword });
    const updatedUser = await userModel.updateOne(
      { _id: req.user._id },
      {
        userName: req.body.userName,
        password: hashPassword,
      }
    );
    return res.status(200).json({ message: "Done", updatedUser });
  } else {
    const updatedUser = await userModel.updateOne(
      { _id: req.params.id },
      req.body
    );
    return res.status(200).json({ message: "Done", updatedUser });
  }
});
