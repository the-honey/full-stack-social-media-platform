import Joi from 'joi';

const addComment = Joi.object({
  content: Joi.string().min(1).required(),
});

const editComment = Joi.object({
  content: Joi.string().min(1).required(),
});

export default { addComment, editComment };
