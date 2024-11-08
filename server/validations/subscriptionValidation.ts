import Joi from 'joi';

export const createSubscriptionSchema = Joi.object({
  plan: Joi.string().valid('BASIC', 'PREMIUM', 'PRO').required(),
  price: Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().default('XOF'),
    interval: Joi.string().valid('MONTHLY', 'QUARTERLY', 'YEARLY').required()
  }).required(),
  paymentMethod: Joi.object({
    type: Joi.string().valid('CARD', 'MOBILE_MONEY').required(),
    details: Joi.object({
      cardNumber: Joi.string().when('type', {
        is: 'CARD',
        then: Joi.required()
      }),
      expiryMonth: Joi.string().when('type', {
        is: 'CARD',
        then: Joi.required()
      }),
      expiryYear: Joi.string().when('type', {
        is: 'CARD',
        then: Joi.required()
      }),
      cvc: Joi.string().when('type', {
        is: 'CARD',
        then: Joi.required()
      }),
      phoneNumber: Joi.string().when('type', {
        is: 'MOBILE_MONEY',
        then: Joi.required()
      })
    }).required()
  }).required()
});