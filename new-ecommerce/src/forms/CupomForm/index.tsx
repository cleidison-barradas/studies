import {
  Box,
  Link,
  Alert,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { getCupom } from '../../services/cupom/cupom.service'
import { debounce } from 'lodash'
import CartContext from '../../contexts/cart.context'
import { CheckCircleRounded } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { ErrorCodes } from '../../helpers/errorCodes'
import { floatToBRL } from '../../helpers/moneyFormat'

export const CupomForm: React.FC = () => {
  const { cart, loadCart, setCart } = useContext(CartContext)
  const [fetching, setFetching] = useState<boolean>(false)
  const [error, setError] = useState<React.ReactNode | null>(null)

  const handleSubmit = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setFetching(true)

    try {
      const {
        target: { value },
      } = event
      const { fingerprint, customerId } = cart

      const response = await getCupom(value, fingerprint)

      if (response.data) {
        const { data } = response
        const { cupom } = data
        const { minimumPrice = 0, amount = 0 } = cupom

        if (data?.error) {
          cart.cupom = null
          setError(ErrorCodes(data.error))

          if (data.error.includes('cart_not_found')) {
            cart.products = []
          }

          if (data?.error.includes('minimum_price_not_reached')) {
            setError(
              <React.Fragment>
                {minimumPrice > 0 && (
                  <React.Fragment>
                    {`Valor mínimo em compras ${floatToBRL(minimumPrice)}`}
                    <Link ml={1} to="/produtos" component={RouterLink}>
                      Adicione mais itens.
                    </Link>
                  </React.Fragment>
                )}
              </React.Fragment>
            )
          }
          if (data?.error.includes('cupom_usage_limit_reached')) {
            setError(
              <React.Fragment>
                {customerId && amount > 0 && (
                  <Typography color="red">
                    Compras permitidas usando esse cupom {amount}x
                  </Typography>
                )}
              </React.Fragment>
            )
          }

          setCart(cart)
          await loadCart()
          setFetching(false)
        } else {
          setError(null)
          cart.cupom = cupom
          setCart(cart)
          await loadCart()
          setFetching(false)
        }
      }
    } catch (err) {
      cart.cupom = null
      setCart(cart)
      await loadCart()
      setFetching(false)
    }
  }, 500)

  return (
    <React.Fragment>
      <Typography>{cart.cupom ? 'Cupom utilizado' : 'Possui algum cupom?'}</Typography>
      <TextField
        onChange={handleSubmit}
        placeholder="insira seu cupom de desconto"
        error={!!error}
        defaultValue={cart.cupom ? cart.cupom.code : undefined}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {fetching && <CircularProgress size="20px" color="primary" />}
              {cart.cupom && !fetching && <CheckCircleRounded color="primary" />}
            </InputAdornment>
          ),
        }}
      />
      {cart.cupom && !fetching && (
        <Box mt={2} mb={{ sm: 2, xs: 2, md: 0 }}>
          <Alert severity="success">
            Cupom <b>{cart.cupom.name}</b> encontrado! <br />
            Desconto será aplicado nos produtos elegiveis.
          </Alert>
        </Box>
      )}
      {error && !fetching && (
        <Typography mt={2} textAlign="center" color="red">
          {error}
        </Typography>
      )}
    </React.Fragment>
  )
}
