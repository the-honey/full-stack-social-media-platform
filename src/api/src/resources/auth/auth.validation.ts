import Joi from 'joi';

const register = Joi.object({
  username: Joi.string().alphanum().min(5).max(16).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().alphanum().min(2).max(30).required(),
  lastName: Joi.string().alphanum().min(2).max(30).required(),
  birthDate: Joi.date().required(),
  password: Joi.string().min(8).max(16).required(),
  passwordConfirm: Joi.string()
    .min(8)
    .max(16)
    .equal(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords must match',
    }),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).max(16).required(),
});

export default { register, login };
