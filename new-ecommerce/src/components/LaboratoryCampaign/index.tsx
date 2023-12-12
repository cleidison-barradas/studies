import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useCart } from '../../hooks/useCart'

import Product from '../../interfaces/product'

import PmbContainerDoctor from '../PmbContainerDoctor'
import PbmContainerRegister from '../PbmContainerRegister'
import PbmContainerFindAccount from '../PbmContainerFindAccount'
import PbmContainerDiscountSuccess from '../PbmContainerDiscountSuccess'

interface Props {
  product: Product
}

export interface ICampaingProps {
  needsRegister: boolean
  needsDoctorData: boolean
}

const LaboratoryCampaign: React.FC<Props> = ({ product }) => {
  const { benefit = null, benefit_sale_price: pbmToPrice = 0 } = product
  const { authorization, getCartFingerPrint, getAuthorizedProduct, getCartEansAuthorized } = useCart()
  const [campaing, setCampain] = useState<ICampaingProps>({ needsDoctorData: false, needsRegister: false })

  const eans = getCartEansAuthorized()
  const fingerprint = getCartFingerPrint()
  const authorized = getAuthorizedProduct(product.EAN)

  if (eans.indexOf(product.EAN) === -1) eans.push(product.EAN)

  return (
    <Box>
      <Box mt={5} mb={2}>
        <Typography fontSize={20}>Programa do Laboratório</Typography>
      </Box>
      {
        authorized && fingerprint ? (
          <PbmContainerDiscountSuccess
            ean={authorized.ean}
            fingerprint={fingerprint}
            onFinish={setCampain}
          />
        ) :
          campaing.needsRegister && benefit ? (
            <PbmContainerRegister
              ean={product.EAN}
              benefit={benefit}
              benefitId={benefit.originalId}
              allowCustomMembership={benefit.allowCustomMembership}
              onFinish={setCampain}
            />
          ) : campaing.needsDoctorData && authorization ? (
            <PmbContainerDoctor
              eans={eans}
              fingerprint={fingerprint!}
              elegibilityToken={authorization.elegibilityToken}
              onFinish={setCampain}
            />
          ) : (
            <PbmContainerFindAccount
              product={product}
              benefit={benefit}
              pbmToPrice={pbmToPrice}
              fingerprint={fingerprint!}
              onFinish={setCampain}
            />
          )
      }

    </Box>
  )
}

export default LaboratoryCampaign
