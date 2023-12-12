import React, { Component } from 'react'
import AutomationType from '../../AutomationType'

class MarketingAutomationForm extends Component {
  render() {
    return (
      <React.Fragment>
        <AutomationType
          name="RECENT_CART"
          image="infoCart"
          title="Carrinhos abandonados"
          text="Se ativo notifica o cliente ao abandonar um carrinho de compras no site"
        />
        <AutomationType
          name="MISS_YOU"
          image="unhappy"
          interval={15}
          title="Não compra há mais de 15 dias"
          text="Se ativo notifica cliente após 15 dias sem realizar uma nova compra no site."
        />
        <AutomationType
          name="MISS_YOU"
          interval={20}
          image="fluExpression"
          title="Não compra há mais de 20 dias"
          text="Se ativo notifica cliente após 20 dias sem realizar uma nova compra no site."
        />
        <AutomationType
          name="MISS_YOU"
          interval={30}
          image="cryingFace"
          title="Não compra há mais de 30 dias"
          text="Se ativo notifica cliente após 30 dias sem realizar uma nova compra no site."
        />
      </React.Fragment>
    )
  }
}

export default MarketingAutomationForm
