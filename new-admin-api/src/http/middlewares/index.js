module.exports = {
  rulesMiddleware: require('./rules.middleware'),
  objectIdValidation: require('./object-id-validation.middleware'),
  authMiddleware: require('./auth.middleware'),
  fieldSchedule: require('./verify.fields.schedule'),
  stoneCardFeeValidation: require('./stoneCardFeeValidation.middleware'),
  affiliateMiddleware: require('./affiliate.middleware')
};
