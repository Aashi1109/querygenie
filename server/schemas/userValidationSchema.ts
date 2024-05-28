import * as Joi from "joi";

const userValidationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .messages({
      "string.alphanum": "Username must only contain alphanumeric characters",
      "string.min": "Username must be at least {#limit} characters long",
      "string.max": "Username must not exceed {#limit} characters",
      "any.required": "Username is required",
    })
    .allow(""),
  name: Joi.string().min(3).max(30).required().messages({
    "string.min": "Name must be at least {#limit} characters long",
    "string.max": "Name must not exceed {#limit} characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email should be valid",
    "any.required": "Email is required",
  }),
  image: Joi.string().uri().required().messages({
    "string.url": "Image should be valid url",
    "any.required": "Image is required",
  }),
});

export default userValidationSchema;
