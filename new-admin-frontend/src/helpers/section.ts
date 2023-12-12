export interface IChildren {
  name: string
  icon: string
  link: string
  helper: string
  description: string
}

export interface ISection {
  title: string
  children: IChildren[]
}

const sections: ISection[] = [
  {
    title: 'Vendas',
    children: [
      {
        name: 'Carrinhos abandonados',
        icon: 'infoCart',
        link: '',
        helper: 'se ativo notifica o cliente ao abandonar um carrinho de compras no site',
        description: 'Incentiva seus clientes a concluirem uma compra abandonada.',
      },
      {
        name: 'Não compra há mais de 15 dias',
        link: '',
        helper: 'se ativo notifica cliente após 15 dias sem realizar uma nova compra no site',
        icon: 'unhappy',
        description: 'Incentiva seus clientes a concluirem uma compra abandonada.',
      },
      {
        name: 'Não compra há mais de 20 dias',
        link: '',
        helper: 'se ativo notifica cliente após 20 dias sem realizar uma nova compra no site',
        icon: 'fluExpression',
        description: 'Incentiva seus clientes a concluirem uma compra abandonada.',
      },
      {
        name: 'Não compra há mais de 30 dias',
        link: '',
        helper: 'se ativo notifica cliente após 30 dias sem realizar uma nova compra no site',
        icon: 'cryingFace',
        description: 'Incentiva seus clientes a concluirem uma compra abandonada.',
      },
    ],
  },
]

export default sections
