import Joi from 'joi';

const createPost = Joi.object({
  content: Joi.string().required(),
});

const editPost = Joi.object({
  content: Joi.string().required(),
});

export default { createPost, editPost };
