import { NewOrderDetailProps } from './model'
import { NewOrderDetailStyled } from './styles'

export const NewOrderDetail = ({}: NewOrderDetailProps) => {
  return (
    <NewOrderDetailStyled>
      <header>
        <div className="title">
          <span>Pedido</span>

          Nº 45712
        </div>

        <div className="title">
          <span>Total</span>

          R$115,66
        </div>

        <div className="title">
          <span>Enviar para</span>

          R$115,66
        </div>
      </header>
    </NewOrderDetailStyled>
  )
}
