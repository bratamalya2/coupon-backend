import Joi from "joi";

const checkout = Joi.object({
  cartIds: Joi.array().items(Joi.string()).required(),
});

export default {
  checkout,
};
