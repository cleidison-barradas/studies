import { Typography } from '@mui/material'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import AuthContext from '../../contexts/auth.context'
import { useEC } from '../../hooks/useEC'
import { searchProducts } from '../../services/search/search.service'
import { ProductSwiper } from '../ProductSwiper'

interface RelatedProductSwiperProps {
  ean: string
  query: string
  size?: number
  classification: string
  activePrinciple: string
}

export const RelatedProductSwiper: React.FC<RelatedProductSwiperProps> = ({ ean, query, size = 20, classification = '', activePrinciple = '' }) => {
  const { addImpression } = useEC()
  const { store } = useContext(AuthContext)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const tenant = store ? store.tenant : ''
  const { data } = useSWR(`search=${query}`, async () => await searchProducts({ store, tenant, fingerprint, query, size }))

  const products = useMemo(() =>
    data ? data.products : []
    , [data])

  useEffect(() => {
    if (data) {
      if (data.fingerprint) {
        setFingerprint(data.fingerprint)
      }
      if (products.length > 0) addImpression(products.slice(0, 10), 'related products')
    }
  }, [data, products, addImpression])

  const handleProducts = () => {
    if (products.length > 0) {
      if (classification.toLowerCase().includes('etico')) {

        return products.filter(product => product.generic && (product.activePrinciple === activePrinciple && product.EAN !== ean))
      } else {

        return products.filter(product => !product.EAN.includes(ean))
      }
    }

    return []
  }

  return (
    <React.Fragment>
      {handleProducts().length > 0 && (
        <React.Fragment>
          <Typography mt={4} variant="subtitle1" fontSize={{ xs: 18, md: 28 }}>
            {classification.toLowerCase().includes('etico') ? 'Genéricos deste produto' : 'Produtos relacionados'}
          </Typography>
          <ProductSwiper buttonColor="primary" products={handleProducts()} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
