import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  phone: Joi.string().required(),
  preferences: Joi.object({
    dietaryRestrictions: Joi.array().items(Joi.string()),
    allergies: Joi.array().items(Joi.string()),
    cuisinePreferences: Joi.array().items(Joi.string()),
    spicyLevel: Joi.string().valid('none', 'mild', 'medium', 'hot', 'extra-hot')
  }),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    district: Joi.string(),
    coordinates: Joi.object({
      lat: Joi.number(),
      lng: Joi.number()
    })
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  phone: Joi.string(),
  preferences: Joi.object({
    dietaryRestrictions: Joi.array().items(Joi.string()),
    allergies: Joi.array().items(Joi.string()),
    cuisinePreferences: Joi.array().items(Joi.string()),
    spicyLevel: Joi.string().valid('none', 'mild', 'medium', 'hot', 'extra-hot')
  }),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    district: Joi.string(),
    coordinates: Joi.object({
      lat: Joi.number(),
      lng: Joi.number()
    })
  })
});