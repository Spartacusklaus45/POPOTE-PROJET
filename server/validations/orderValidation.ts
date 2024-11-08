import Joi from 'joi';

export const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      recipe: Joi.string().required(),
      quantity: Joi.number().required().min(1),
      price: Joi.number().required()
    })
  ).required(),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number(),
      lng: Joi.number()
    })
  }).required(),
  deliverySlot: Joi.object({
    date: Joi.date().required(),
    timeSlot: Joi.string().required()
  }).required(),
  paymentMethod: Joi.string().valid('CARD', 'MOBILE_MONEY', 'CASH').required()
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED')
    .required()
});