import { usePaymentMethod } from './usePaymentMethod'
import { useCart } from './useCart'
import { flagsRegex } from "../helpers/identifyCardByFlagRegex"

export function useInstallments() {
  const { getActiveGatewayCardMethod } = usePaymentMethod()
  const activeGatewayMethod = getActiveGatewayCardMethod()

  const { getCartValue } = useCart()

  const getMaxInstallments = (): number => activeGatewayMethod?.installmentsDetails?.maxInstallments ?? 12

  const minValueToInstallments = (): number => {
    return activeGatewayMethod?.installmentsDetails?.minValueToInstallments ?? 0
  }

  const diffBetweenMinAndCartTotal = (): number => {
    return minValueToInstallments() - getCartValue().total
  }

  const isInstallmentsAvaliable = (): boolean =>
    getMaxInstallments() > 1 && minValueToInstallments() !== 0 && diffBetweenMinAndCartTotal() >= 0 ? false : true

  const getCardFlag = (cardNumber: string): string => {
    const cleanedNumber = cardNumber.replace(/\D/g, '')

    if (flagsRegex.VISA.test(cleanedNumber)) return 'visa'
    if (flagsRegex.MASTER_CARD.test(cleanedNumber)) return 'mastercard'
    if (flagsRegex.AMERICAN_EXPRESS.test(cleanedNumber)) return 'american_express'
    if (flagsRegex.HIPERCARD.test(cleanedNumber)) return 'hipercard'
    if (flagsRegex.ELO.test(cleanedNumber)) return 'elo'
    if (flagsRegex.CABAL.test(cleanedNumber)) return 'cabal'

    return 'unknown'
  }

  return {
    diffBetweenMinAndCartTotal,
    minValueToInstallments,
    getCardFlag,
    getMaxInstallments,
    isInstallmentsAvaliable
  }
}
