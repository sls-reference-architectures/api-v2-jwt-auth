import Joi from "joi";
import { BadRequest } from "http-errors";
import { CreateTokenRequest } from "./models";

const schema = Joi.object({
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
});

const validate = (payload: CreateTokenRequest) => {
  const result = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (result.error) {
    throw new BadRequest(`Bad Request: ${result.error.message}`);
  }

  return result.value;
};

export default validate;
