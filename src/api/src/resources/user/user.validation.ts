import Joi from 'joi';

const getUser = Joi.object({
  userId: Joi.string().required(),
});

const editUser = Joi.object({
  firstName: Joi.string().regex(/\D+/).min(2).max(30).optional(),
  lastName: Joi.string().regex(/\D+/).min(2).max(30).optional(),
  description: Joi.string().max(300).optional(),
  birthDate: Joi.date().optional(),
});

export default { getUser, editUser };
