module.exports = async (req, res, next) => {
  const { paymentMethod } = req.body
  const { paymentOption, installmentsDetails } = paymentMethod

  if (paymentMethod && paymentOption) {
    if (paymentOption.name === 'Stone') {
      if (installmentsDetails) {
        const {
          maxInstallments,
          minValueToInstallments,
          applyInstallmentsFee,
          applyInstallmentsFeeFrom,
          manualFee,
          cardsFlagFee,
          minValueToInstallmentsFlag
        } = installmentsDetails

        if (maxInstallments > 12 && maxInstallments <= 0) {
          return res.status(406).json({
            error: 'not_acceptable_validation_error',
            error_details: 'invalid_maxInstallments'
          })
        }

        if (applyInstallmentsFeeFrom > maxInstallments) {
          return res.status(406).json({
            error: 'not_acceptable_validation_error',
            error_details: 'invalid_applyInstallmentsFeeFrom'
          })
        }

        if (minValueToInstallmentsFlag) {
          if (minValueToInstallments <= 0 && typeof minValueToInstallments === 'number') {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_minValueToInstallments'
            })
          }
        }

        if (applyInstallmentsFee && manualFee) {
          if (cardsFlagFee.visaFee.twoToSixFee >= 25 || cardsFlagFee.visaFee.twoToSixFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }
          if (cardsFlagFee.visaFee.sevenToTwelveFee >= 25 || cardsFlagFee.visaFee.sevenToTwelveFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }

          if (cardsFlagFee.masterCardFee.twoToSixFee >= 25 || cardsFlagFee.masterCardFee.twoToSixFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }
          if (cardsFlagFee.masterCardFee.sevenToTwelveFee >= 25 || cardsFlagFee.masterCardFee.sevenToTwelveFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }

          if (cardsFlagFee.americanExpressFee.twoToSixFee >= 25 || cardsFlagFee.americanExpressFee.twoToSixFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }
          if (cardsFlagFee.americanExpressFee.sevenToTwelveFee >= 25 || cardsFlagFee.americanExpressFee.sevenToTwelveFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }

          if (cardsFlagFee.hipercardFee.twoToSixFee >= 25 || cardsFlagFee.hipercardFee.twoToSixFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }
          if (cardsFlagFee.hipercardFee.sevenToTwelveFee >= 25 || cardsFlagFee.hipercardFee.sevenToTwelveFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }

          if (cardsFlagFee.eloFee.twoToSixFee >= 25 || cardsFlagFee.eloFee.twoToSixFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }
          if (cardsFlagFee.eloFee.sevenToTwelveFee >= 25 || cardsFlagFee.eloFee.sevenToTwelveFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }

          if (cardsFlagFee.cabalFee.twoToSixFee >= 25 || cardsFlagFee.cabalFee.twoToSixFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }
          if (cardsFlagFee.cabalFee.sevenToTwelveFee >= 25 || cardsFlagFee.cabalFee.sevenToTwelveFee <= 0) {
            return res.status(406).json({
              error: 'not_acceptable_validation_error',
              error_details: 'invalid_cardsFlagFee'
            })
          }

        }

      } else {

        return res.status(406).json({
          error: 'not_acceptable_validation_error',
        })

      }
    }
  } else {

    return res.status(406).json({
      error: 'not_acceptable_validation_error',
    })

  }

  next()
}
