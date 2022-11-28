import { ReactionType } from '@prisma/client';
import Joi from 'joi';

const addReaction = Joi.object({
  reactionType: Joi.valid(...Object.values(ReactionType)).required(),
});

export default { addReaction };
