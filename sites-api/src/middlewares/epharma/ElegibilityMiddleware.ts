import { celebrate, Joi, Segments } from 'celebrate'

export default celebrate({
  [Segments.PARAMS]: {
    benefitId: Joi.string().required()
  },
  [Segments.BODY]: Joi.object().keys({
    ean: Joi.number().required(),
    fingerprint: Joi.string().required(),
    identifyCustomer: Joi.string().required()
  })
})
