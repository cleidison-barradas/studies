const { ObjectID } = require('bson')

const paymentMethod = {
  _id: new ObjectID('6483a3fd9134eb352165513a'),
  extras: ['a', 'b'],
  paymentOption: {
    _id: 'rh8734gf93g49f6gg06f7g469023',
    name: 'Stone',
    type: 'gateway',
    createdAt: '2020-10-29T15:00:00.000Z',
    updatedAt: '2020-10-29T15:00:00.000Z',
  },
  installmentsDetails: {
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
  },
  createdAt: '2020-10-29T15:00:00.000Z',
  updatedAt: '2020-10-29T15:00:00.000Z',
}

const updatedPaymentMethod = {
  _id: new ObjectID('6483a3fd9134eb352165513a'),
  extras: ['a', 'b'],
  paymentOption: {
    _id: 'rh8734gf93g49f6gg06f7g469023',
    name: 'Stone',
    type: 'gateway',
    createdAt: '2020-10-29T15:00:00.000Z',
    updatedAt: '2020-10-29T15:00:00.000Z',
  },
  installmentsDetails: {
    _id: 'rh8734gf93g49f6gg06f7g469023',
    maxInstallments: 12,
    minValueToInstallments: 0,
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
  },
  createdAt: '2020-10-29T15:00:00.000Z',
  updatedAt: '2020-10-29T15:00:00.000Z',
}

const paymentMethodList = [
  {
    _id: new ObjectID('6483a3fd9134eb352165513a'),
    extras: ['a', 'b'],
    paymentOption: {
      _id: 'rh8734gf93g49f6gg06f7g469023',
      name: 'Stone',
      type: 'gateway',
      createdAt: '2020-10-29T15:00:00.000Z',
      updatedAt: '2020-10-29T15:00:00.000Z',
    },
    installmentsDetails: {
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
    },
    createdAt: '2020-10-29T15:00:00.000Z',
    updatedAt: '2020-10-29T15:00:00.000Z',
  },
  {
    _id: '6483a3fd9134eb352165513b',
    extras: ['a', 'b'],
    paymentOption: {
      _id: 'rh8734gf93g49f6gg06f7g469023',
      name: 'Stone',
      type: 'gateway',
      createdAt: '2020-10-29T15:00:00.000Z',
      updatedAt: '2020-10-29T15:00:00.000Z',
    },
    installmentsDetails: {
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
    },
    createdAt: '2020-10-29T15:00:00.000Z',
    updatedAt: '2020-10-29T15:00:00.000Z',
  },
  {
    _id: '6483a3fd9134eb352165513c',
    extras: ['a', 'b'],
    paymentOption: {
      _id: 'rh8734gf93g49f6gg06f7g469023',
      name: 'Stone',
      type: 'gateway',
      createdAt: '2020-10-29T15:00:00.000Z',
      updatedAt: '2020-10-29T15:00:00.000Z',
    },
    installmentsDetails: {
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
    },
    createdAt: '2020-10-29T15:00:00.000Z',
    updatedAt: '2020-10-29T15:00:00.000Z',
  },
  {
    _id: '6483a3fd9134eb352165513d',
    extras: ['a', 'b'],
    paymentOption: {
      _id: 'rh8734gf93g49f6gg06f7g469023',
      name: 'Stone',
      type: 'gateway',
      createdAt: '2020-10-29T15:00:00.000Z',
      updatedAt: '2020-10-29T15:00:00.000Z',
    },
    installmentsDetails: {
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
    },
    createdAt: '2020-10-29T15:00:00.000Z',
    updatedAt: '2020-10-29T15:00:00.000Z',
  }
]

module.exports = { paymentMethod, updatedPaymentMethod, paymentMethodList }
