import VisaFlag from '../../../assets/images/visaFlag.svg'
import MasterFlag from '../../../assets/images/masterFlag.svg'
import AmexFlag from '../../../assets/images/amexFlag.svg'
import EloFlag from '../../../assets/images/eloFlag.svg'
import HipercardFlag from '../../../assets/images/hipercardFlag.svg'
import CabalFlag from '../../../assets/images/cabalFlag.svg'

export const CREDIT_CARD_FLAGS = [
  {
    id: 1,
    imageFlag: VisaFlag,
    alt: 'visa flag',
    twoToSixFee: 'paymentMethod.installmentsDetails.cardsFlagFee.visaFee.twoToSixFee',
    sevenToTwelveFee: 'paymentMethod.installmentsDetails.cardsFlagFee.visaFee.sevenToTwelveFee'
  },
  {
    id: 2,
    imageFlag: MasterFlag,
    alt: 'master flag',
    twoToSixFee: 'paymentMethod.installmentsDetails.cardsFlagFee.masterCardFee.twoToSixFee',
    sevenToTwelveFee: 'paymentMethod.installmentsDetails.cardsFlagFee.masterCardFee.sevenToTwelveFee'
  },
  {
    id: 3,
    imageFlag: AmexFlag,
    alt: 'amex flag',
    twoToSixFee: 'paymentMethod.installmentsDetails.cardsFlagFee.americanExpressFee.twoToSixFee',
    sevenToTwelveFee: 'paymentMethod.installmentsDetails.cardsFlagFee.americanExpressFee.sevenToTwelveFee'
  },
  {
    id: 4,
    imageFlag: EloFlag,
    alt: 'hipercard flag',
    twoToSixFee: 'paymentMethod.installmentsDetails.cardsFlagFee.hipercardFee.twoToSixFee',
    sevenToTwelveFee: 'paymentMethod.installmentsDetails.cardsFlagFee.hipercardFee.sevenToTwelveFee'
  },
  {
    id: 5,
    imageFlag: HipercardFlag,
    alt: 'elo flag',
    twoToSixFee: 'paymentMethod.installmentsDetails.cardsFlagFee.eloFee.twoToSixFee',
    sevenToTwelveFee: 'paymentMethod.installmentsDetails.cardsFlagFee.eloFee.sevenToTwelveFee'
  },
  {
    id: 6,
    imageFlag: CabalFlag,
    alt: 'cabal flag',
    twoToSixFee: 'paymentMethod.installmentsDetails.cardsFlagFee.cabalFee.twoToSixFee',
    sevenToTwelveFee: 'paymentMethod.installmentsDetails.cardsFlagFee.cabalFee.sevenToTwelveFee'
  },
]
