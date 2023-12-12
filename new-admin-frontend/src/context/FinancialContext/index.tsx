import { createContext } from 'react'
import { PaymentMethodFaturAgil } from '../../components/Financial'
import { workerFaturAgilApi } from '../../config'
import { getCustomer, getInvoicesPending, getIssuedNfes, putRecurringCard } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import StoreContext from '../StoreContext'

interface ChangeRecurringCardRequest {
  cpf: string
  cvc: string
  expiry: string
  name: string
  number: string
}

export interface PutRecurringCard {
  cardNumber: string
  cardCvv: string
  printedNameCard: string
  cpfCardHolder: string
  cardExpiration: {
    month: string
    year: string
  }
}

export interface InvoiceProps {
  idCobranca: number
  idCliente: number
  cpfCnpj: string
  nomeFantasia: string
  razaoSocial: string
  numeroTitulo: number
  numeroParcela: number
  dataEmissao: string
  dataVencimentoOriginal: string
  dataVencimento: string
  dataPagamento: string | null
  isQuitado: boolean
  competencia: string
  valor: number
  valorPago: number | null
  valorMoraMulta: number
  valorDesconto: number
  linhaDigitavel: string
  metodoPagamento: string
  faturaVencidaMaisDe60Dias: boolean
}

export interface CustomerProps {
  idCliente: number
  idIntegracao: string
  isAtivo: boolean
  nomeFantasia: string
  cpfCnpj: string
  email: string
  meioPagamento: string
  diaVencimentoCobranca: number
  cartaoCredito: {
    numeroCartao: string
    cvvCartao: string
    vencimentoCartao: string
    nomeImpressoCartao: string
    cpfPortadorCartao: string
  }
  dataExpiracao: string
}

interface FinancialContextState extends BaseContextState {
  invoices: InvoiceProps[] | undefined
  customer: CustomerProps[] | undefined
  nfes: InvoiceProps[] | undefined
  paymentMethodSelected: PaymentMethodFaturAgil | undefined
}

interface FinancialContextData extends FinancialContextState {
  changeRecurringCard: (data: ChangeRecurringCardRequest, customerId: number) => Promise<void>
  printNfe: (numberInvoice: number) => Promise<void>
  printInvoice: (numberInvoice: number) => Promise<void>
  findInvoicesPending: (cnpj: string) => Promise<void>
  findIssuedNfes: (cnpj: string) => Promise<void>
  findCustomer: (cnpj: string) => Promise<void>
}

const FinancialContext = createContext({} as FinancialContextData)
const { Provider, Consumer } = FinancialContext
export default FinancialContext
export const FinancialConsumer = Consumer

export class FinancialProvider extends BaseContextProvider {
  static contextType = StoreContext as any

  state: FinancialContextState = {
    invoices: undefined,
    customer: undefined,
    nfes: undefined,
    paymentMethodSelected: undefined,
  }

  changeRecurringCard = async (data: ChangeRecurringCardRequest, customerId: number) => {
    try {
      this.startRequest(workerFaturAgilApi)

      const creditCard = {
        cardNumber: data.number.trim(),
        cardCvv: data.cvc.trim(),
        printedNameCard: data.name,
        cpfCardHolder: data.cpf,
        cardExpiration: {
          month: data.expiry.substring(0, 2),
          year: data.expiry.substring(data.expiry.length - 4),
        },
      }

      const response = await putRecurringCard(creditCard, customerId)
      if (!response.ok) {
        throw new Error('Erro na chamada à API para atualizar o cartão recorrente.')
      }
    } catch (error) {
      throw error
    }
  }

  printNfe = async (numberInvoice: number) => {
    try {
      const response = await fetch(`${workerFaturAgilApi}/nfe/${numberInvoice}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `nfe-mypharma-${numberInvoice}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        throw new Error('Erro na chamada à API para gerar a nota fiscal')
      }
    } catch (error) {
      throw error
    }
  }

  printInvoice = async (numberInvoice: number) => {
    try {
      const response = await fetch(`${workerFaturAgilApi}/invoice/${numberInvoice}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `boleto-mypharma-${numberInvoice}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        throw new Error('Erro na chamada à API para gerar a fatura')
      }
    } catch (error) {
      throw error
    }
  }

  findInvoicesPending = async (cnpj: string) => {
    try {
      this.startRequest(workerFaturAgilApi)

      const response = await getInvoicesPending(cnpj)

      if (response.ok) {
        this.setState({
          invoices: response.data,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  findCustomer = async (cnpj: string) => {
    try {
      this.startRequest(workerFaturAgilApi)

      const response = await getCustomer(cnpj)

      if (response.ok) {
        this.setState({
          customer: response.data,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  findIssuedNfes = async (cnpj: string) => {
    try {
      this.startRequest(workerFaturAgilApi)

      const response = await getIssuedNfes(cnpj)

      if (response.ok) {
        this.setState({
          nfes: response.data,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          changeRecurringCard: this.changeRecurringCard,
          printNfe: this.printNfe,
          printInvoice: this.printInvoice,
          findInvoicesPending: this.findInvoicesPending,
          findCustomer: this.findCustomer,
          findIssuedNfes: this.findIssuedNfes,
        }}
      >
        {children}
      </Provider>
    )
  }
}
