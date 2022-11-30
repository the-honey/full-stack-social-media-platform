import Joi from 'joi';

const verificationToken = Joi.object({
  token: Joi.string().required(),
});

export default { verificationToken };
