import { Typography } from '@material-ui/core'
import { Button } from '@mypharma/react-components'
import React from 'react'

import { Container, TextContainer } from './styles'

export const EmptyOrderContainer: React.FC = () => {
  return (
    <Container>
      <TextContainer>
        <Typography fontSize={24}>Ops, parece que ainda não possui pedidos...</Typography>
        <Typography fontSize={12}>
          Volte a buscar pelos produtos do seu interesse e finalize uma compra pra acompanhar seu
          pedido.
        </Typography>
      </TextContainer>

      <Button fullWidth uppercase variant="filled">
        continuar comprando
      </Button>
    </Container>
  )
}
