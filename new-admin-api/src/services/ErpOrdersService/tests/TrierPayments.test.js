const { parsePayments } = require('../TrierService.js')

describe('parsePayments', () => {
  test('returns payment object with money payment option', () => {
    const payment = {
      paymentOption: {
        type: 'money',
      },
    };
    const moneyChange = 10.50
    const total = 100.00
    const parsedPayment = parsePayments(payment, moneyChange, total)
    expect(parsedPayment).toEqual({
      pagamentoRealizado: false,
      valorParcela: 100.00,
      dataVencimento: null,
      valorDinheiro: 89.50,
      valorTroco: 10.50,
      numeroAutorizacao: null,
    })
  })

  test('returns payment object with money payment option and no change', () => {
    const payment = {
      paymentOption: {
        type: 'money',
      },
    }
    const moneyChange = 0
    const total = 100.00
    const parsedPayment = parsePayments(payment, moneyChange, total)
    expect(parsedPayment).toEqual({
      pagamentoRealizado: false,
      valorParcela: 100.00,
      dataVencimento: null,
      valorDinheiro: 100.00,
      valorTroco: 0.00,
      numeroAutorizacao: null,
    })
  })

  test('returns payment object with non-money payment option', () => {
    const payment = {
      paymentOption: {
        type: 'credit_card',
      },
    }
    const moneyChange = 10.50
    const total = 100.00
    const parsedPayment = parsePayments(payment, moneyChange, total)
    expect(parsedPayment).toEqual({
      pagamentoRealizado: true,
      valorParcela: 100.00,
      dataVencimento: null,
      valorDinheiro: 0.00,
      valorTroco: 0.00,
      numeroAutorizacao: null,
    })
  })
})
