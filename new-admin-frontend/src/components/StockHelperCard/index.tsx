/* tslint:disable */

import { StockHelperCardProps } from './model'
import { StockHelperCardContainer } from './styles'

export const StockHelperCard = ({ icon, name, description, action, onAction }: StockHelperCardProps) => (
  <StockHelperCardContainer>
    <img src={icon} alt={name} />

    <h3>{name}</h3>
    <p>{description}</p>

    <button onClick={() => onAction()}>{action}</button>
  </StockHelperCardContainer>
)
