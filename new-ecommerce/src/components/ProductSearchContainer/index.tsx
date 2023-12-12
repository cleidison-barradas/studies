import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { useTheme } from 'styled-components'
import { NotFoundSearch } from '../../assets/ilustration'
import AuthContext from '../../contexts/auth.context'
import { useEC } from '../../hooks/useEC'
import { useSearch } from '../../hooks/useSearch'
import { ProductCard } from '../ProductCard'
import { trackPageView } from '@elastic/behavioral-analytics-javascript-tracker'

export const ProductSearchContainer: React.FC = () => {
  const { products, query, isValidating } = useSearch()
  const { store } = useContext(AuthContext)
  const { color } = useTheme()
  const { addImpression } = useEC()

  useEffect(() => {
    if (products) {
      trackPageView()
      addImpression(products, 'search')
    }
  }, [products, addImpression])

  return (
    <Stack>
      {products !== undefined && products.length === 0 && !isValidating ? (
        <Stack justifyContent="center" alignItems="center" width="100%">
          <NotFoundSearch height={150} color={color.primary.medium} />
          <Typography mb={3} mt={3} variant="subtitle1" fontSize={24} fontWeight={500}>
            Não encontramos sua busca
          </Typography>
          <Box ml={4}>
            <Typography mb={1} textAlign="left" fontSize={18} fontWeight={500}>
              Dicas para melhorar sua busca:
            </Typography>
            <Typography fontSize={18}>
              - Verifique se não houve erro de digitação. <br />
              - Procure por um termo similar. <br />
              - Tente procurar termos mais gerais. <br />
            </Typography>
          </Box>
        </Stack>
      ) : (
        <React.Fragment>
          <Typography variant="h1" fontSize={18} fontWeight={500}>
            {store!.name}
          </Typography>
          <Typography mt={2} variant="subtitle1" fontSize={24}>
            Resultado para <strong>"{query}"</strong>
            {isValidating && <CircularProgress size={20} sx={{ marginLeft: 2 }} />}
          </Typography>
          <Typography mt={2} mb={2}>{products.length} PRODUTOS ENCONTRADOS</Typography>
          <Box>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: 'center', sm: 'normal' }}
              overflow={'auto'}
              wrap={'wrap'}
            >
              {products?.map((product) => (
                <Grid mb={5} xs={6} sm="auto" md={'auto'} key={product._id} item>
                  <ProductCard key={product._id} product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </React.Fragment>
      )}
    </Stack>
  )
}

export default ProductSearchContainer
