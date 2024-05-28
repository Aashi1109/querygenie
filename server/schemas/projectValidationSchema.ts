import * as Joi from "joi";

const projectValidationSchema = Joi.object({
  name: Joi.string().required().min(5).max(20).messages({
    "string.required": "Project name is required",
    "string.min": "Project name should be minimum 5 characters",
    "string.max": "Project name should be max 20 characters",
  }),
  description: Joi.string().optional().allow(""),
  fileDataId: Joi.number()

    .messages({ "number.any": "File data should be number" })
    .optional(),
  userId: Joi.number()
    .required()
    .messages({ "string.required": "User id is required" }),
});

export default projectValidationSchema;
