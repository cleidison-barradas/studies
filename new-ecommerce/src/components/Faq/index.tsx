import React, { useContext, useState, useEffect } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Caption, Container, Title, WhatsappButton } from './styles'
import { WhatsappIcon } from '../../assets/icons'

import { Box, Link, Stack, Typography } from '@mui/material'
import { FaqItem } from '../FaqItem'
import AuthContext from '../../contexts/auth.context'
import { formatPhoneNumber } from '../../helpers/formatPhoneNumber'
import {
  getCheapeastNeighborhood,
} from '../../helpers/getExpensiveRegion'

import useSWR from 'swr'
import { getPaymentMethods } from '../../services/payment/payment.service'
import { getDeliveryRegions, getDistanceDeliveryRegions } from '../../services/delivery/delivery.service'
import { useDelivery } from '../../hooks/useDelivery'
import { waypointContext } from '../../contexts/waypoint.context'
import { CheckoutModal } from '../CheckoutModal'
import DeliveryFreeFromList from '../DeliveryFreeFromList'
import DeliveryMinimumPurchaseList from '../DeliveryMinimumPurchaseList'
import { floatToBRL } from '../../helpers/moneyFormat'

export const Faq = () => {
  const [openDeliveryFreeModal, setDeliveryFreeModal] = useState<boolean>(false)
  const [openDeliveryMinimumModal, setDeliveryMinimumModal] = useState<boolean>(false)
  const { store } = useContext(AuthContext)
  const { data } = useSWR('deliveryRegions', getDeliveryRegions)
  const { data: distanceDeliveryRegionsData } = useSWR('distanceDeliveryRegions', getDistanceDeliveryRegions)
  const { shouldRenderOptionals } = useContext(waypointContext)
  const { data: paymentOptionsRequest } = useSWR('paymentMethods', getPaymentMethods)
  const [onDeliveryPayments, setOnDeliveryPayments] = useState('')
  const [onlinePayments, setOnlinePayments] = useState('')

  const { hasShippingAvailable, useFetchDelivery } = useDelivery()
  const { data: deliveries } = useFetchDelivery(shouldRenderOptionals)

  useEffect(() => {
    const deliveryPaymentOptions = paymentOptionsRequest?.paymentMethods
      .filter((value) => value.paymentOption.type !== 'gateway' && value.paymentOption.type !== 'ticket')
      .map((value) => value.paymentOption.name)
      .join(', ') ?? ''

    const onlinePaymentOptions = paymentOptionsRequest?.paymentMethods
      ?.filter((value) => value.paymentOption.type === 'gateway' || value.paymentOption.type === 'ticket')
      .map((value) => parsePaymentOptionName(value.paymentOption.name.toLowerCase()))
      .join(', ') ?? ''

    setOnlinePayments(onlinePaymentOptions)
    setOnDeliveryPayments(deliveryPaymentOptions)
  }, [paymentOptionsRequest])

  const localDeliveryRule = store?.settings.config_local_delivery_rule || 'neighborhood'
  const isGenericStore = store?.plan.rule.includes('generic')
  const storeCity = store?.settings.config_store_city || ''

  let hasminimumPurchase = null
  if(localDeliveryRule !== 'distance'){
    hasminimumPurchase = deliveries
    .filter((d) => d.minimumPurchase > 0)
    .sort((a, b) => a.minimumPurchase - b.minimumPurchase)
    .shift()
  }
  else if(distanceDeliveryRegionsData){
    hasminimumPurchase = distanceDeliveryRegionsData.regions
    .filter((d) => d.minimumPurchase > 0)
    .sort((a, b) => a.minimumPurchase - b.minimumPurchase)
    .shift()
  }

  const parsePaymentOptionName = (name: string) => {
    const parse: Record<string, string> = {
      pagseguro: 'Cartão de crédito',
      stone: 'Cartão de crédito',
    }

    if (name in parse) {
      return parse[name]
    }

    return name
  }

  return (
    <Container>
      <HelpOutlineIcon sx={{ fontSize: 64 }} color="inherit" />
      <Title> {isGenericStore ? "Perguntas frequentes sobre nossa loja online" : "Perguntas frequentes sobre nossa farmácia online"} </Title>
      <Stack width="100%">
        <FaqItem
          title="Posso confiar em comprar pelo site?"
          description={`Sim! Nossa loja preza pela confiança e qualidade de serviço.
Trabalhamos com transparência total e qualquer dúvida sobre nós, estamos a disposição para esclarecer pelo número ${formatPhoneNumber(
            store?.settings.config_phone || ''
          )} ${store?.settings.config_whatsapp_phone &&
          `ou WhatsApp ${formatPhoneNumber(store.settings.config_whatsapp_phone)}`
            }`}
        />
        <FaqItem
          title="Como finalizo um pedido?"
          description={
            <React.Fragment>
              <Typography>
                Você pode pesquisar por um produto diretamente pela barra de buscas do site (topo do
                site), adicionar este produto à cesta, ou então navegar pelas categorias, na parte
                superior do site, encontrar seus produtos e adicionar à cesta. <br /> A partir
                disto, é super simples comprar pelo site! Basta seguir no fluxo:
              </Typography>
              <Box ml={3} mt={1} mb={1}>
                <ol>
                  <li>Clique no ícone de 'cesta' para continuar.</li>
                  <li>
                    Identificação (rápido e curto cadastro que você irá fazer para continuar).
                  </li>
                  <li>Endereço (local onde você deseja receber sua entrega).</li>
                  <li>Pagamento (escolha pagar online ou apenas na entrega!).</li>
                </ol>
              </Box>
              <Typography>
                Fácil, né? Aposto que depois que você fazer uma compra em nosso site, vai continuar
                comprando nele :)
              </Typography>
            </React.Fragment>
          }
        />
        <FaqItem
          title="Quais são os locais de entrega?"
          description={
            <React.Fragment>
              {localDeliveryRule === 'distance' ? (
                distanceDeliveryRegionsData?.regions && distanceDeliveryRegionsData.regions.length > 0 ? (
                  `Entregamos por delivery para endereços localizados em até ${distanceDeliveryRegionsData.regions[distanceDeliveryRegionsData.regions.length - 1].distance / 1000}Km de distância da loja.`
                ) : 'Sem entregas locais disponíveis no momento.'
              ) : (
                data?.regions && `Entregamos por delivery nas seguintes cidades: ${data.regions?.map((value) => `${value._id} - ${value.deliveryFees[0].neighborhood.city.state.code}`).join(',')}`
              )}
              <br />
              {hasShippingAvailable && 'Para demais regiões do Brasil, entregamos via Correios ou transportadoras.'}
            </React.Fragment>
          }
        />
        <FaqItem
          title="Qual é o tempo de entrega?"
          description={
            <React.Fragment>
              Nossos tempos médios de entregas por delivery são o seguintes:
              {
               localDeliveryRule === 'distance' ?
               distanceDeliveryRegionsData?.regions &&
               distanceDeliveryRegionsData.regions.map((value) => (
                  <React.Fragment key={value._id}>
                  <br />
                    {` Até ${(value.distance/1000)
                      || 0}Km : ${Math.round(value.deliveryTime || 0)} minutos `}
                  </React.Fragment>
               ))
               :
                data?.regions &&
                data.regions.map((value) => (
                  <React.Fragment key={value._id}>
                    <br />
                    {` ${value._id} - ${value.deliveryFees[0].neighborhood.city.state.code
                      } : ${Math.round(value.averageTime || 0)} minutos `}
                  </React.Fragment>
                ))
              }
              <br />
              {hasShippingAvailable
                ? 'Para demais regiões do Brasil,  siga no fluxo de um pedido para saber qual o tempo de entrega para sua região.'
                : ''}
            </React.Fragment>
          }
        />
        <FaqItem
          title="Qual o valor do frete?"
          description={
            <React.Fragment>
              Nosso frete para delivery é o seguinte:
              {
              localDeliveryRule === 'distance' ?
              distanceDeliveryRegionsData?.regions &&
              distanceDeliveryRegionsData.regions.map(region =>{

                return (
                  <React.Fragment key={region._id}>
                    <br />
                    {`Até ${(region.distance || 0)/1000}Km -`} a partir de: {floatToBRL(region.feePrice || 0)}
                  </React.Fragment>
                )
              })
              :
              data?.regions &&
                data.regions.map(region => {
                  const feePrice = getCheapeastNeighborhood(region)?.feePrice || 0
                  const city = region._id
                  const stateCode = region.deliveryFees[0].neighborhood.city.state.code || ''

                  return (
                    <React.Fragment key={region._id}>
                      <br />
                      {`${city} - ${stateCode}`} a partir de: {floatToBRL(feePrice)}
                    </React.Fragment>
                  )
                })
              }
              <br />
              {hasShippingAvailable
                ? 'Para demais regiões do Brasil, siga no fluxo de um pedido para saber qual o tempo de entrega para sua região.'
                : ''}
            </React.Fragment>
          }
        />
        <FaqItem
          title="Existe frete grátis?"
          description={
            <React.Fragment>
            {
              (localDeliveryRule === 'distance' && distanceDeliveryRegionsData?.regions && distanceDeliveryRegionsData.regions.filter(d => d.freeFrom > 0).length > 0) ||
              (deliveries && deliveries.filter(Region => Region.freeFrom > 0).length > 0) ? (
                <React.Fragment>
                  Sim! <br />
                  Consulte as regras de frete grátis <Link onClick={() => setDeliveryFreeModal(!openDeliveryFreeModal)}>clicando aqui.</Link>
                  <CheckoutModal open={openDeliveryFreeModal} onClose={() => setDeliveryFreeModal(false)}>
                    <Typography mb={5}>Regras de frete grátis</Typography>
                    {localDeliveryRule === 'distance' && distanceDeliveryRegionsData?.regions && distanceDeliveryRegionsData.regions.filter(Region => Region.freeFrom > 0).map(region => (
                      <div key={region._id}>
                       <Typography mb={5}> Até {region.distance/1000}Km - Grátis a partir de: {floatToBRL(region.freeFrom)}</Typography>
                      </div>
                    ))}
                    {
                     localDeliveryRule !== 'distance' && <DeliveryFreeFromList open={openDeliveryFreeModal} />
                    }
                  </CheckoutModal>
                </React.Fragment>
              ) : 'Não'
            }
            </React.Fragment>
          }
        />
        <FaqItem
          title="Possui valor mínimo de compra?"
          description={
            <React.Fragment>
              {hasminimumPurchase ? (
                <React.Fragment>
                  Sim! <br />
                  Consulte as regras de valor mínimo em compras <Link onClick={() => setDeliveryMinimumModal(!openDeliveryMinimumModal)}>clicando aqui.</Link>
                  <CheckoutModal open={openDeliveryMinimumModal} onClose={() => setDeliveryMinimumModal(false)}>
                    <Typography mb={5} >Regras de valor mínimo de em compras</Typography>

                    {localDeliveryRule === 'distance' && distanceDeliveryRegionsData?.regions && distanceDeliveryRegionsData.regions.filter(Region => Region.minimumPurchase > 0).map(region => (
                      <div key={region._id}>
                       <Typography mb={5}> Até {region.distance/1000}Km - Valor mínimo: {floatToBRL(region.minimumPurchase)}</Typography>
                      </div>
                    ))}
                    {
                     localDeliveryRule !== 'distance' && <DeliveryMinimumPurchaseList open={openDeliveryMinimumModal} />
                    }


                  </CheckoutModal>
                </React.Fragment>
              )
                : `Não! Qualquer valor de pedido pode ser feito em nossa loja virtual.`}
            </React.Fragment>
          }
        />
        <FaqItem
          title="Consigo pagar na entrega?"
          description={
            onDeliveryPayments.length > 0 ? (
              <React.Fragment>
                Sim! Em dinheiro ou cartão (débito e crédito), nos seguintes locais:
                <br />
                {(localDeliveryRule !== 'distance'  && data?.regions &&
                data.regions
                  .map(
                    (value) =>
                      `${value._id} - ${value.deliveryFees[0].neighborhood.city.state.code} `
                  )
                  .join(',')
                )
                ||
                storeCity
                  }
              </React.Fragment>
            ) : (
              <>
                Atualmente não é possível pagamento na entrega!
              </>
            )
          }
        />
        <FaqItem
          title="Quais são as formas de pagamento?"
          description={
            <React.Fragment>
              {onDeliveryPayments.length > 0 && (
                <>
                  Pagamentos na entrega:{onDeliveryPayments}
                  <br />
                </>
              )}
              {onlinePayments.length > 0 && (
                <>
                  Pagamentos online:{onlinePayments}
                </>
              )}
              {onDeliveryPayments.length <= 0 && onlinePayments.length <= 0 && (
                <>Não possuem metodos de pagamentos disponíveis.</>
              )}
            </React.Fragment>
          }
        />
        <FaqItem
          title="Como faço troca ou devolução de um pedido?"
          description={`Basta fazer contato conosco pelo email ${store?.settings.config_email} ${store?.settings.config_whatsapp_phone &&
            `ou WhatsApp ${formatPhoneNumber(store.settings.config_whatsapp_phone)}`
            }`}
        />
      </Stack>
      <Caption>Fale com nosso time de especialista</Caption>
      {store?.settings.config_whatsapp_phone && (
        <WhatsappButton
          rel="noopener noreferrer"
          target="_blank"
          href={`https://api.whatsapp.com/send?phone=55${store?.settings.config_whatsapp_phone.replace(/[^0-9]/g, '')}&text=Olá, vim pelo site!`}
        >
          Ainda com dúvidas? Fale conosco <WhatsappIcon style={{ height: 26 }} />
        </WhatsappButton>
      )}
    </Container>
  )
}

export default Faq