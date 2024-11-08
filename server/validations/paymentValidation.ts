import Joi from 'joi';

export const processPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  paymentMethod: Joi.string().valid('CARD', 'MOBILE_MONEY').required(),
  paymentDetails: Joi.object({
    cardNumber: Joi.string().when('paymentMethod', {
      is: 'CARD',
      then: Joi.required()
    }),
    expiryMonth: Joi.string().when('paymentMethod', {
      is: 'CARD',
      then: Joi.required()
    }),
    expiryYear: Joi.string().when('paymentMethod', {
      is: 'CARD',
      then: Joi.required()
    }),
    cvc: Joi.string().when('paymentMethod', {
      is: 'CARD',
      then: Joi.required()
    }),
    phoneNumber: Joi.string().when('paymentMethod', {
      is: 'MOBILE_MONEY',
      then: Joi.required()
    })
  }).required()
});