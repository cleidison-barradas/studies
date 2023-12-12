import { celebrate, Joi, Segments } from 'celebrate'

export default celebrate({
  [Segments.PARAMS]: {
    fingerprint: Joi.string().required()
  },
  [Segments.BODY]: Joi.object().keys({
    doctorUf: Joi.string().required(),
    doctorName: Joi.string(),
    recipeDate: Joi.string().required(),
    registerType: Joi.number().required(),
    doctorRegister: Joi.number().required(),
    elegibilityToken: Joi.string().required(),
    eans: Joi.array<string>().min(1).required()
  })
})
