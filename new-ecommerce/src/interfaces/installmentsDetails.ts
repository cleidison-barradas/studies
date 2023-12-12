interface StoneInstallmentFee {
  twoToSixFee: number
  sevenToTwelveFee: number
}

interface StoneCardsFlagFee {
  visaFee: StoneInstallmentFee
  masterCardFee: StoneInstallmentFee
  americanExpressFee: StoneInstallmentFee
  hipercardFee: StoneInstallmentFee
  eloFee: StoneInstallmentFee
  cabalFee: StoneInstallmentFee
}

export default interface InstallmentsDetails {
  maxInstallments: number
  minValueToInstallments?: number
  applyInstallmentsFee: boolean
  applyInstallmentsFeeFrom?: number
  manualFee?: boolean
  cardsFlagFee?: StoneCardsFlagFee | unknown
}
