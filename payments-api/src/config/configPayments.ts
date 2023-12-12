interface IPayment {
  code: string,
  name: string
}

export const paymentCode:IPayment[]  = [
  {
    code: "mypharma",
    name: "Pagar na entrega"
  },
  {
    code: "pagseguro",
    name: "Pagseguro"
  },
  {
    code: "picpay",
    name: "Picpay"
  },
  {
    code: "convenio",
    name: "Convenio"
  },
  {
    code: "pix",
    name: "Pix"
  },
  {
    code: "stone",
    name: "Stone"
  },
  {
    code: "ticket",
    name: "Boleto"
  },
]