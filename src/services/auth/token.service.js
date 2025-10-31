import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import moment from "moment";
import Token from "../../models/token.model.js";
import ApiError from "../../helpers/apiErrorConverter.js";

const makeToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { algorithm: config.jwt.algo });
};

const generateAuthTokens = (user) => {
  const accessToken = makeToken({
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(config.jwt.accessExpirationMinutes, "minutes").unix(),
    aud: "access",
    iss: config.jwt.issuer,
  });

  const refreshToken = makeToken({
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(config.jwt.refreshExpirationDays, "days").unix(),
    aud: "refresh",
    iss: config.jwt.issuer,
  });

  return { access: accessToken, refresh: refreshToken };
};

const verifyToken = async (token, type) => {
  const tokenInDb = await Token.findOne({ token, type });

  if (tokenInDb) {
    throw new ApiError("Token blacklisted", 401);
  }
  return jwt.verify(token, config.jwt.secret, {
    algorithm: config.jwt.algo,
    issuer: config.jwt.issuer,
    audience: type,
  });
};

const blacklistToken = async (token, type) => {
  return Token.create({ token, type });
};

export default {
  generateAuthTokens,
  verifyToken,
  blacklistToken,
};
