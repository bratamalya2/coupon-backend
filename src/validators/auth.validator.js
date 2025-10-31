import Joi from "joi";

const password = (value, helpers) => {
  if (
    !value.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    )
  ) {
    return helpers.message(
      "Password must me 8 characters long with at least one capital letter, one small letter, one digit, one special character"
    );
  }
  return value;
};

const register = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  password: Joi.string().required().custom(password),
  role: Joi.string().valid("product-owner", "admin").optional()
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().custom(password),
});

const forgot = Joi.object({
  email: Joi.string().email().required(),
});

const verify = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().max(6).min(6).required(),
});

const reset = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().max(6).min(6).required(),
  password: Joi.string().required().custom(password),
});

const tokens = Joi.object({
  token: Joi.string().required(),
});

const logout = Joi.object({
  access: Joi.string().required(),
  refresh: Joi.string().required(),
});

export default {
  register,
  login,
  forgot,
  verify,
  reset,
  tokens,
  logout,
};
