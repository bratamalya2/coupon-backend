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

const passchange = Joi.object({
  password_new: Joi.string().required().custom(password),
  password_old: Joi.string().required().custom(password),
});

const profile = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.number().optional(),
});

export default {
  passchange,
  profile,
};
