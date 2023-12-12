import React, { Component } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import styled from 'styled-components'

import { IShipping } from '../../interfaces/shipping'

interface Props {
  shipping: IShipping[] | undefined
}

const CaptionCard = styled.div`
  background-color: #F03E3E;
  font-size: 14px;
  padding: 16px 0px;
  display: flex;
  text-align: center;
  justify-content: center;
  border-radius: 8px;
  width: '100%';
`

export class ErrorMessage extends Component<Props> {
  render() {
    const { shipping } = this.props

    const shippingErrors =
      shipping
        ? Array.from(
          new Set(
            shipping
              .filter((value, indice, self) => self.indexOf(value) === indice)
              .map(method => method.msg_error)
          )
        )
        : []

    const getErrorMessage = (error: string | null) => {
      if (error && error.toString() === 'O CEP de destino está temporariamente sem entrega domiciliar. A entrega será efetuada na agência indicada no Aviso de Chegada que será entregue no endereço do destinatário.') {
        return 'O CEP de destino está temporariamente sem entrega domiciliar.'
      }
    }

    return (
      <Stack spacing={1} style={{ width: '100%' }}>
        <CaptionCard>
          <Box style={{ padding: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, }}>
            {shippingErrors.length > 0 && shippingErrors.map((error, index) => {
              return (
                <>
                  <Typography key={index} variant='h3' fontSize={17} color='#FFFFFF'>
                    {getErrorMessage(error)}
                  </Typography>
                </>
              )
            })}
          </Box>
        </CaptionCard>
      </Stack>
    )
  }
}

export default ErrorMessage

