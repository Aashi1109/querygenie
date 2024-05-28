import * as Joi from "joi";

const messageValidationSchema = Joi.object({
  chatId: Joi.number()
    .required()
    .messages({ "number.required": "Chat ID is required" }),
  query: Joi.string()
    .required()
    .messages({ "string.required": "Query is required" }),
  answer: Joi.string().optional(),
  messageId: Joi.number()
    .optional()
    .messages({ "number.any": "Message ID should be valid number" }),
  userId: Joi.number()
    .optional()
    .messages({ "number.any": "User ID should be valid number" }),
});

export default messageValidationSchema;
