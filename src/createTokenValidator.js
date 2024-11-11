import Joi from 'joi';
import { BadRequest } from 'http-errors';

const schema = Joi.object({
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
});

const validate = (payload) => {
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
