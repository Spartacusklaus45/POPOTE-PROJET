import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid('LOCAL', 'INTERNATIONAL').required(),
  preparationTime: Joi.number().required(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').required(),
  servings: Joi.number().required(),
  ingredients: Joi.array().items(
    Joi.object({
      item: Joi.string().required(),
      quantity: Joi.number().required(),
      unit: Joi.string().required()
    })
  ).required(),
  instructions: Joi.array().items(Joi.string()).required(),
  imageUrl: Joi.string().required(),
  nutritionalInfo: Joi.object({
    calories: Joi.number(),
    protein: Joi.number(),
    carbs: Joi.number(),
    fat: Joi.number(),
    fiber: Joi.number()
  })
});

export const updateRecipeSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  category: Joi.string().valid('LOCAL', 'INTERNATIONAL'),
  preparationTime: Joi.number(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD'),
  servings: Joi.number(),
  ingredients: Joi.array().items(
    Joi.object({
      item: Joi.string().required(),
      quantity: Joi.number().required(),
      unit: Joi.string().required()
    })
  ),
  instructions: Joi.array().items(Joi.string()),
  imageUrl: Joi.string(),
  nutritionalInfo: Joi.object({
    calories: Joi.number(),
    protein: Joi.number(),
    carbs: Joi.number(),
    fat: Joi.number(),
    fiber: Joi.number()
  })
});

export const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required()
});