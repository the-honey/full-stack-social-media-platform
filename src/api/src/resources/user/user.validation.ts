import Joi from 'joi';

const getUser = Joi.object({
  userId: Joi.string().required(),
});

const editUser = Joi.object({
  firstName: Joi.string().alphanum().min(2).max(30).optional(),
  lastName: Joi.string().alphanum().min(2).max(30).optional(),
  description: Joi.string().alphanum().max(300).optional(),
});

export default { getUser, editUser };
