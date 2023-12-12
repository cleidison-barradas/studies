const installmentsDetails = {
  _id: 'rh8734gf93g49f6gg06f7g469023',
  maxInstallments: 12,
  minValueToInstallments: 250,
  applyInstallmentsFee: false,
  applyInstallmentsFeeFrom: 1,
  manualFee: true,
  cardsFlagFee: {
    visaFee: {
      twoToSixFee: 4.93,
      sevenToTwelveFee: 65.75
    },
    masterCardFee: {
      twoToSixFee: 5.65,
      sevenToTwelveFee: 97.87
    },
    americanExpressFee: {
      twoToSixFee: 6.45,
      sevenToTwelveFee: 67.56
    },
    hipercardFee: {
      twoToSixFee: 64.56,
      sevenToTwelveFee: 7.56
    },
    eloFee: {
      twoToSixFee: 64.56,
      sevenToTwelveFee: 7.56
    },
    cabalFee: {
      twoToSixFee: 65.45,
      sevenToTwelveFee: 56.75
    }
  },
  createdAt: '2020-10-29T15:00:00.000Z',
  updatedAt: '2020-10-29T15:00:00.000Z',
}

module.exports = { installmentsDetails }
