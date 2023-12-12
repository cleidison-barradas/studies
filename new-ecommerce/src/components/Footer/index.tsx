import { Box, Divider, Stack, Link, Typography } from '@mui/material'
import React, { useContext } from 'react'
import {
  BoletoIcon,
  LocationIcon,
  MailIcon,
  MasterCard,
  MoneyIcon,
  PhoneIcon,
  VisaIcon,
} from '../../assets/icons'
import AuthContext from '../../contexts/auth.context'
import { formatPhoneNumber } from '../../helpers/formatPhoneNumber'
import { Container, IconWrapper, LegalInformations } from './styles'
import LogoAnvisa from '../../assets/ilustration/Logo-Anvisa.webp'
import { ReactComponent as SafeBrowsingLogo } from '../../assets/ilustration/SafeBrowsingLogo.svg'
import { ReactComponent as MypharmaLogo } from '../../assets/ilustration/MypharmaLogo.svg'
import { CDN } from '../../config/keys'
import { useTheme } from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { getPaymentMethods } from '../../services/payment/payment.service'
import PicpayIlustration from '../../assets/ilustration/picpay.webp'
import PixIlustration from '../../assets/ilustration/pix.webp'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import useSWR from 'swr'
import { waypointContext } from '../../contexts/waypoint.context'
import { formatAFE } from '../../helpers/formatAFE'
import { formatCNPJ } from '../../helpers/formatCNPJ'

export const Footer: React.FC = () => {
  const { store } = useContext(AuthContext)
  const { shouldRenderOptionals } = useContext(waypointContext)
  const { color } = useTheme()

  const { data: paymentOptionsRequest } = useSWR('paymentMethods', () =>
    shouldRenderOptionals ? getPaymentMethods() : undefined
  )
  const isGenericStore = store?.plan.rule.includes('generic')

  const paymentOptionToIcon: any = {
    pix: <img loading="lazy" src={PixIlustration} key="pix" height={'auto'} width={70} alt="Pix" />,
    picpay: (
      <img
        loading="lazy"
        key={'picpay'}
        src={PicpayIlustration}
        height={'auto'}
        width={70}
        alt="picpay"
      />
    ),
    stone: (
      <Box key="stone" color="white">
        <QrCode2Icon color="inherit" />
      </Box>
    ),
    boleto: <BoletoIcon key="boleto" color="white" />,
  }

  return (
    <Container>
      <Box m={3} mt={0}>
        <Stack
          justifyContent={{ md: 'space-between', lg: 'center' }}
          gap={{ lg: '150px' }}
          direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row', xl: 'row' }}
        >
          <Stack spacing={3}>
            <Typography
              fontWeight="bold"
              mt={4}
              mb={1}
              fontSize={24}
              color={color.footerTextColor}
              variant="h3"
            >
              Institucional
            </Typography>
            <Link
              color={color.footerTextColor}
              fontSize={16}
              underline={'none'}
              to="sobre"
              component={RouterLink}
            >
              Sobre nós
            </Link>
            <Link
              color={color.footerTextColor}
              fontSize={16}
              underline={'none'}
              to="politicas-de-privacidade"
              component={RouterLink}
            >
              Política de privacidade
            </Link>
            <Link
              color={color.footerTextColor}
              fontSize={16}
              underline={'none'}
              to="trocas-e-devolucoes"
              component={RouterLink}
            >
              Trocas e devoluções
            </Link>
          </Stack>
          <Stack spacing={3}>
            <Typography
              fontWeight="bold"
              mt={4}
              mb={1}
              fontSize={24}
              color={color.footerTextColor}
              variant="h3"
            >
              {store?.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconWrapper>
                <LocationIcon />
              </IconWrapper>
              <Typography fontSize={16} color={color.footerTextColor}>
                <strong>
                  {store?.settings.config_address}, {store?.settings.config_store_number}
                </strong>{' '}
                <br />
                {store?.settings.config_store_city}. <br />
                CEP: {store?.settings.config_cep}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconWrapper>
                <PhoneIcon />
              </IconWrapper>
              <Typography fontSize={16} color={color.footerTextColor}>
                {formatPhoneNumber(store?.settings.config_phone || '')}
              </Typography>
              <Typography fontSize={0} color={color.footerTextColor}>
                {'+55'+(store?.settings.config_phone || '').replace(/\D/g,'')}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconWrapper>
                <MailIcon />
              </IconWrapper>
              <Typography
                style={{ wordBreak: 'break-word' }}
                fontSize={16}
                color={color.footerTextColor}
              >
                {store?.settings.config_email}
              </Typography>
            </Stack>
          </Stack>

          <Stack>
            <Box mt={3}>
              {shouldRenderOptionals && (
                <img
                  loading="lazy"
                  style={{ maxHeight: 250, borderRadius: '100%' }}
                  src={new URL(store?.settings.config_logo || '', CDN.image).href}
                  alt={store?.name}
                />
              )}
            </Box>
            <Typography
              variant="h4"
              fontSize={24}
              mt={4}
              mb={4}
              fontWeight="bold"
              color={color.footerTextColor}
            >
              Querido cliente!
            </Typography>
            <Typography fontSize={20} variant="h4" color={color.footerTextColor}>
              É um prazer ter você aqui
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box mt={6} mb={6}>
        <Divider />
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        p={5}
        justifyContent="center"
        spacing={5}
        pb={5}
      >
        {!isGenericStore && (
          <Box>
            <Stack alignItems={{ md: 'center' }} justifyContent={{ md: 'center' }}>
              <Typography fontSize={16} color={color.footerTextColor}>
                <strong>Farmacêutico Responsável:</strong>
              </Typography>
              <Typography fontSize={16} color={color.footerTextColor}>
                {store?.settings.config_pharmacist_name}
              </Typography>
              <Typography fontSize={16} color={color.footerTextColor}>
                CRF: {store?.settings.config_pharmacist_crf}
              </Typography>

              <Box maxWidth="500px" mt={3}>
                <Typography fontSize={14} color={color.footerTextColor}>
                  As informações contidas neste site não devem ser usadas para automedicação e não
                  substituem, em hipótese alguma, as orientações dadas pelo profissional da área
                  médica. Somente o médico está apto a diagnosticar qualquer problema de saúde e
                  prescrever o tratamento adequado.
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <Box>
          <Stack alignItems={{ md: 'center' }} justifyContent={{ md: 'center' }}>
            <Typography fontSize={22} fontWeight={600} color={color.footerTextColor}>
              Meios de Pagamento
            </Typography>
            <Stack alignItems="center" direction="row" mt={2} spacing={1}>
              <MoneyIcon height={25} color="white" />
              <VisaIcon />
              <MasterCard />
              {paymentOptionsRequest?.paymentMethods
                .filter(
                  ({ paymentOption }) => paymentOptionToIcon[paymentOption.name.toLowerCase()]
                )
                .map(({ paymentOption }) => paymentOptionToIcon[paymentOption.name.toLowerCase()])}
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <LegalInformations>
        <Box m={3} mt={4}>
          <Stack alignItems="center" justifyContent={{ md: 'center' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
              {!isGenericStore && (
                <Stack direction="row" spacing={1}>
                  {shouldRenderOptionals && (
                    <img loading="lazy" height={40} src={LogoAnvisa} alt="Logo anvisa" />
                  )}
                  <Typography fontSize={9} color={color.footerTextColor}>
                    Agência Nacional <br />
                    de Vigilância Sanitária
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" spacing={1}>
                <Link
                  style={{ textDecoration: 'none' }}
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://transparencyreport.google.com/safe-browsing/search?url=${window.location.origin}`}
                >
                  <SafeBrowsingLogo />
                </Link>
                <Typography color={color.footerTextColor} fontSize={9}>
                  Google Safe Browsing
                  <br />
                  <strong>Site 100% Seguro</strong>
                </Typography>
              </Stack>
            </Stack>
            <Box mt={4} mb={4}>
              <Stack direction="row" spacing={2}>
                <Typography fontSize={14} color={color.footerTextColor}>
                  Desenvolvido por
                </Typography>
                <a rel="noopener noreferrer" target="_blank" href="https://www.mypharma.com.br/">
                  <MypharmaLogo />
                </a>
              </Stack>
            </Box>
            <Typography fontSize={14} mb={2} color={color.footerTextColor}>
              © Copyright {store?.settings.config_company_name} / {store?.name}
              {store?.settings.config_afe && store.settings.config_afe.length > 0 &&
                <React.Fragment> | AFE {formatAFE(store?.settings.config_afe)} |</React.Fragment>
              }
              {' CNPJ: '}{' '} {formatCNPJ(store?.settings.config_cnpj)} - {new Date().getFullYear()}
            </Typography>
          </Stack>
        </Box>
      </LegalInformations>
    </Container>
  )
}
