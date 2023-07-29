import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  signture = process.env.TOKEN_SIGNATURE,
  expiresIn = 60 * 30,
} = {}) => {
  const token = jwt.sign(payload, signture, { expiresIn });
  return token;
};

export const verifyToken = ({
  token,
  signture = process.env.TOKEN_SIGNATURE,
} = {}) => {
  const decoded = jwt.verify(token, signture);
  return decoded;
};
