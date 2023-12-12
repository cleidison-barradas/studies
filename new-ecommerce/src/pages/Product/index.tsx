import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'
import { CDN } from '../../config/keys'
import { loadProduct } from '../../services/product/product.service'
import {
  DesktopCard,
  DisclaimerCard,
  ProductApresentation,
  ProductImage,
  ProductImageContainer,
  ProductName,
  ProductPrice,
  ProductPromotionalPrice,
  WhatsappButton,
  ReturnButton,
  DescriptionContainer,
} from './styles'
import ProductImageExample from '../../assets/ilustration/ProductImageExample.svg'
import { Box, Grid, Hidden, Stack, Typography, Button } from '@mui/material'
import { DiscountTag } from '../../components/ProductCard/styles'
import { useTheme } from 'styled-components'
import { getProductActivePromotion } from '../../helpers/getProductActivePromotion'
import { BackArrowIcon, WhatsappIcon } from '../../assets/icons'
import { decode } from 'html-entities'
import { Faq } from '../../components/Faq'
import { getPercentage } from '../../helpers/getPercentage'
import { AddButton } from '@mypharma/react-components'
import { useCart } from '../../hooks/useCart'
import TabBarContext from '../../contexts/tabbar.context'
import { ProductHelmet } from '../../components/ProductHelmet'
import { ProductFooter } from '../../components/ProductFooter'
import { ProductShareButton } from '../../components/ProductShareButton'
import { ProductPromotionCard } from '../../components/ProductPromotionCard'
import { WatcherRelatedProductSwiper } from '../../components/WatcherRelatedProductSwiper'
import { SameCategoryProductSwiper } from '../../components/SameCategoryProductSwiper'
import { RelatedProductSwiper } from '../../components/RelatedProductSwiper'
import { ProdutTecInfo } from '../../components/ProductTecInfo'
import { saveProductHistory } from '../../services/searchHistory/searchHistory.service'
import { useEC } from '../../hooks/useEC'
import Capitalize from '../../helpers/Capitalize'
import { floatToBRL } from '../../helpers/moneyFormat'
import { useDelivery } from '../../hooks/useDelivery'
import { getProductPrice } from '../../helpers/getProductPrice'
import { useAuth } from '../../hooks/useAuth'
import CustomTag from '../../components/CustomTag'
import { getBenefitIsValid } from '../../helpers/getBenefitIsValid'
import LaboratoryCampaign from '../../components/LaboratoryCampaign'
import { lowestProductValue } from '../../helpers/lowestProductValue'
import CardDelivery from '../../components/CardDelivery'

const Product: React.FC = () => {
  const { slug } = useParams()
  const { hideTabbar } = useContext(TabBarContext)
  const navigate = useNavigate()
  const { color } = useTheme()
  const { addProduct, getProduct, removeProduct, getAuthorizedProduct } = useCart()
  const { store } = useAuth()

  const params = new URLSearchParams(window.location.search)
  const isVirtualProduct = params.has('v')

  const { data, isValidating } = useSWR(
    `product/${slug}`,
    async () => await loadProduct(slug!, isVirtualProduct)
  )
  const { viewProduct, addToCart } = useEC()
  const { getExpensiveRegion } = useDelivery()

  const expensiveRegion = getExpensiveRegion()

  const [lockFixed, setLockedFixed] = useState(false)

  const product = data?.product || null

  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      if (window.scrollY >= window.document.body.offsetHeight / 2 - 60 && lockFixed === false) {
        setLockedFixed(true)
      } else setLockedFixed(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    hideTabbar(true)

    return () => hideTabbar(false)
  }, [hideTabbar])

  useEffect(() => {
    if (data) {
      if (data?.product) {
        saveProductHistory(data.product)
        viewProduct(data.product)
      } else if (!isValidating) {
        return navigate('/404')
      }
    }
  }, [data, isValidating, viewProduct, navigate])

  const storeSettings = store?.settings
  const shouldHideStock = storeSettings?.config_stock_display === true

  if (product) {
    const {
      _id,
      EAN = '',
      price = 0,
      name = '',
      quantity = 0,
      image = null,
      category = [],
      control = null,
      presentation = '',
      description = '',
      manufacturer = null,
      classification = null,
      activePrinciple = '',
    } = product

    const [firstname, lastname] =
      manufacturer && manufacturer.name ? manufacturer.name.split(' ') : ['', '']

    const authorizedProduct = getAuthorizedProduct(product.EAN)

    const lowestPrice = lowestProductValue({ product, authorizedProduct })

    const onChangeProductQuantity = (value: number) => {
      if (value === 0) {
        removeProduct(_id)
      } else {
        if (value > 0 && value <= quantity) {
          addProduct(product, value)
          addToCart(product, 'product page')
        }
      }
    }

    const onClickBuy = () => {
      const exists = getProduct(_id)

      if (!exists) {
        addProduct(product, 1)
        addToCart(product, 'product page')
      }

      setTimeout(() => {
        navigate('/checkout')
      }, 1000)
    }

    const deliveryFree = !!(
      expensiveRegion &&
      expensiveRegion.freeFrom !== 0 &&
      expensiveRegion.freeFrom < getProductPrice(price, getProductActivePromotion(product)?.price)
    )

    const isDocks = product?.updateOrigin === 'Docas'

    const deliveryTime = isDocks
      ? `${parseInt(`${(expensiveRegion?.deliveryTime || 0) / 60 + 120}`, 10)} horas`
      : `${expensiveRegion?.deliveryTime}min`
    const withCourier = storeSettings?.config_shipping_courier
    const withBestShipping = storeSettings?.config_best_shipping

    const channel = withCourier ? 'Correios' : withBestShipping ? 'Melhor envio' : ''
    const feeFast = !isDocks

    const chooseDelivery = (
      <CardDelivery
        pallete={color}
        address={expensiveRegion?.neighborhood.name ?? ''}
        time={deliveryTime}
        isFree={deliveryFree}
        active={feeFast}
        isFast={feeFast}
        price={expensiveRegion?.feePrice}
        channel={channel}
      />
    )

    return (
      <Box>
        <Hidden lgDown>
          <Box mt={3}>
            <ReturnButton
              onClick={() => {
                if (window.history.state) {
                  navigate(-1)
                } else {
                  navigate('/', { replace: true }) // the current entry in the history stack will be replaced with the new one with { replace: true }
                }
              }}
            >
              <BackArrowIcon />
            </ReturnButton>
          </Box>
        </Hidden>
        <Grid mt={{ sm: 2, md: 2, lg: 0, xl: 0 }} spacing={2} container>
          <Hidden lgUp>
            <Grid item>
              <Stack mt={4} mb={2} alignItems="center" direction="row" gap={2}>
                <ReturnButton
                  onClick={() => {
                    if (window.history.state) {
                      navigate(-1)
                    } else {
                      navigate('/', { replace: true }) // the current entry in the history stack will be replaced with the new one with { replace: true }
                    }
                  }}
                >
                  <BackArrowIcon />
                </ReturnButton>
                <ProductName>{Capitalize(name)}</ProductName>
              </Stack>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <ProductImageContainer>
              <ProductImage
                src={image && image.key ? new URL(image.key, CDN.image).href : ProductImageExample}
                loading="lazy"
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = ProductImageExample
                  e.currentTarget.style.padding = '0px'
                }}
              />
              {lowestPrice && (
                <DiscountTag top="16px" left="16px">
                  {getPercentage(price, lowestPrice)}
                </DiscountTag>
              )}
            </ProductImageContainer>

            <Hidden lgDown>
              {getProductActivePromotion(product)?.date_end && quantity > 0 && (
                <Box mt={3}>
                  <ProductPromotionCard date_end={getProductActivePromotion(product)!.date_end} />
                </Box>
              )}

              {getBenefitIsValid({ product }) && <LaboratoryCampaign product={product} />}

              {description && (
                <React.Fragment>
                  <Typography mb={2} mt={5} fontSize={18}>
                    Descrição
                  </Typography>
                  <DescriptionContainer dangerouslySetInnerHTML={{ __html: decode(description) }} />
                </React.Fragment>
              )}
              <Box mt={3}>
                <ProdutTecInfo product={product} />
              </Box>
              <RelatedProductSwiper
                ean={EAN}
                query={name}
                activePrinciple={activePrinciple || ''}
                classification={classification?.name || ''}
              />
              <SameCategoryProductSwiper ean={EAN} categories={category} />
              <WatcherRelatedProductSwiper ean={EAN} />
              <Box mt={10}>
                <Faq />
              </Box>
            </Hidden>
          </Grid>
          <Grid item width="100%" xs={12} sm={12} position="relative" md={12} lg={4} xl={4}>
            <Box ml={{ xs: 0, md: 2 }} position={lockFixed ? 'absolute' : 'fixed'} maxWidth={288}>
              <Hidden lgDown>
                <DesktopCard>
                  <Grid direction="column" container gap={2}>
                    <Hidden smDown>
                      <ProductName>{Capitalize(name)}</ProductName>
                      <ProductApresentation> {presentation} </ProductApresentation>
                    </Hidden>

                    {getBenefitIsValid({ product }) && (
                      <CustomTag
                        label="Desconto Laboratório"
                        color={color.suportColor.laboratoryColor}
                        background={color.suportColor.laboratoryBackground}
                      />
                    )}

                    {!!expensiveRegion && chooseDelivery}

                    <Hidden mdUp>
                      <ProductApresentation>{presentation}</ProductApresentation>
                    </Hidden>
                    <Stack direction="row" alignItems="end" justifyContent="space-between">
                      <Stack direction="row" gap={0.5} alignItems="end">
                        <ProductPrice>
                          {lowestPrice ? floatToBRL(lowestPrice) : floatToBRL(price)}
                        </ProductPrice>
                        <Typography mb={0.4}> cada </Typography>
                      </Stack>
                      {lowestPrice && (
                        <ProductPromotionalPrice>{floatToBRL(price)}</ProductPromotionalPrice>
                      )}
                    </Stack>
                    {manufacturer && (
                      <Stack direction="row" gap={0.5}>
                        <Typography>Fabricante: </Typography>
                        <ProductApresentation>
                          {firstname} {lastname}
                        </ProductApresentation>
                      </Stack>
                    )}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        fontWeight={500}
                        color={
                          quantity > 0 ? color.feedback.approve.medium : color.feedback.error.medium
                        }
                      >
                        {quantity > 0
                          ? shouldHideStock
                            ? 'disponível'
                            : `${quantity} disponíveis`
                          : 'indisponível'}
                      </Typography>

                      <ProductShareButton name={name} />
                    </Stack>
                    {control && (
                      <DisclaimerCard>
                        VENDA PROIBIDA VIA INTERNET. MEDICAMENTO SUJEITO A CONTROLE ESPECIAL
                        MEDIANTE RETENÇÃO DA RECEITA. PORTARIA Nº 344 - 01/02/1999 - MINISTÉRIO DA
                        SAÚDE.
                      </DisclaimerCard>
                    )}
                  </Grid>
                </DesktopCard>
                <Stack mt={1} gap={2} direction="row" justifyContent="space-between">
                  {control || quantity < 1 ? (
                    <WhatsappButton
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://api.whatsapp.com/send?phone=55${store?.settings.config_whatsapp_phone?.replace(
                        /[^0-9]/g,
                        ''
                      )}&text=Olá, estava vendo o *${name}*, de valor *${
                        getProductActivePromotion(product)
                          ? floatToBRL(getProductActivePromotion(product)!.price)
                          : floatToBRL(price)
                      }* no site.`}
                    >
                      <WhatsappIcon height={26} /> Enviar mensagem
                    </WhatsappButton>
                  ) : (
                    <React.Fragment>
                      <AddButton
                        onClick={onChangeProductQuantity}
                        maxWidth
                        disableIncrease={getProduct(_id)?.quantity === quantity}
                        value={getProduct(_id)?.quantity || 0}
                      />
                      <Button
                        onClick={() => {
                          const newQuantity = getProduct(_id)?.quantity || 0
                          onChangeProductQuantity(newQuantity + 1)
                        }}
                        color="secondary"
                        variant="contained"
                        style={{ color: color.cta }}
                        fullWidth
                      >
                        Comprar
                      </Button>
                    </React.Fragment>
                  )}
                </Stack>
              </Hidden>
            </Box>
          </Grid>
          {
            // Mobile
          }
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <Hidden lgUp>
              <React.Fragment>
                <DesktopCard>
                  <Grid direction="column" container gap={2}>
                    <Hidden smDown>
                      <ProductName>{Capitalize(name)}</ProductName>
                      <ProductApresentation> {presentation} </ProductApresentation>
                    </Hidden>

                    {getBenefitIsValid({ product }) && (
                      <CustomTag
                        label="Desconto Laboratório"
                        color={color.suportColor.laboratoryColor}
                        background={color.suportColor.laboratoryBackground}
                      />
                    )}

                    {!!expensiveRegion && chooseDelivery}

                    <Hidden mdUp>
                      <ProductApresentation> {presentation} </ProductApresentation>
                    </Hidden>
                    <Stack direction="row" alignItems="end" justifyContent="space-between">
                      <Stack direction="row" gap={0.5} alignItems="end">
                        <ProductPrice>
                          {getProductActivePromotion(product)
                            ? floatToBRL(getProductActivePromotion(product)!.price)
                            : floatToBRL(price)}
                        </ProductPrice>
                        <Typography mb={0.4}> cada </Typography>
                      </Stack>
                      {getProductActivePromotion(product) && (
                        <ProductPromotionalPrice>{floatToBRL(price)}</ProductPromotionalPrice>
                      )}
                    </Stack>
                    {manufacturer && (
                      <Stack direction="row" gap={0.5}>
                        <Typography>Fabricante: </Typography>
                        <ProductApresentation>
                          {firstname} {lastname}
                        </ProductApresentation>
                      </Stack>
                    )}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        fontWeight={500}
                        color={
                          quantity > 0 ? color.feedback.approve.medium : color.feedback.error.medium
                        }
                      >
                        {quantity > 0
                          ? shouldHideStock
                            ? 'disponível'
                            : `${quantity} disponíveis`
                          : 'indisponível'}
                      </Typography>

                      <ProductShareButton name={name} />
                    </Stack>
                    {getProductActivePromotion(product)?.date_end && quantity > 0 && (
                      <Box mt={1}>
                        <ProductPromotionCard
                          date_end={getProductActivePromotion(product)!.date_end}
                        />
                      </Box>
                    )}
                    {control && (
                      <DisclaimerCard>
                        VENDA PROIBIDA VIA INTERNET. MEDICAMENTO SUJEITO A CONTROLE ESPECIAL
                        MEDIANTE RETENÇÃO DA RECEITA. PORTARIA Nº 344 - 01/02/1999 - MINISTÉRIO DA
                        SAÚDE.
                      </DisclaimerCard>
                    )}
                  </Grid>
                  {getBenefitIsValid({ product }) && <LaboratoryCampaign product={product} />}

                  {description && (
                    <React.Fragment>
                      <Typography mt={2} fontSize={18}>
                        Descrição
                      </Typography>
                      <DescriptionContainer
                        dangerouslySetInnerHTML={{ __html: decode(description) }}
                      />
                    </React.Fragment>
                  )}
                </DesktopCard>
              </React.Fragment>

              <Box mt={3}>
                <ProdutTecInfo product={product} />
              </Box>
              <RelatedProductSwiper
                ean={EAN}
                query={name.split(' ')[0] || name}
                activePrinciple={activePrinciple || ''}
                classification={classification?.name || ''}
              />
              <SameCategoryProductSwiper ean={EAN} categories={category} />
              <WatcherRelatedProductSwiper ean={EAN} />

              <Box mt={8}>
                <Faq />
              </Box>
            </Hidden>
          </Grid>
        </Grid>
        <Hidden lgUp>
          <ProductFooter
            onChangeProductQuantity={onChangeProductQuantity}
            onClickBuy={onClickBuy}
            product={product}
          />
        </Hidden>
        <ProductHelmet product={product} />
      </Box>
    )
  }

  return <div />
}

export default Product
