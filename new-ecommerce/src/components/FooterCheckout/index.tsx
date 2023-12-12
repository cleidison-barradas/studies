import { Box, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { Container, LegalInformations } from './styles'
import { ReactComponent as SafeBrowsingLogo } from '../../assets/ilustration/SafeBrowsingLogo.svg'
import LogoAnvisa from '../../assets/ilustration/Logo-Anvisa.webp'

export const FooterCheckout: React.FC = () => {
  return (
    <Container>
      <LegalInformations>
        <Box m={3} mt={4}>
          <Stack direction="row" justifyContent="center" alignItems="center" gap={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <img height={40} src={LogoAnvisa} alt="Logo anvisa" />
              <Typography fontSize={12}>
                Seguimos todas leis <br /> da <strong>ANVISA</strong>
              </Typography>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Link
                style={{ textDecoration: 'none' }}
                rel="noopener noreferrer"
                target="_blank"
                href={`https://transparencyreport.google.com/safe-browsing/search?url=${window.location.origin}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize={14}
                gap={2}
              >
                <SafeBrowsingLogo />
                <Typography fontSize={12}>
                  Google Safe Browsing <br />
                  <strong>Site 100% Seguro</strong>
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </LegalInformations>
    </Container>
  )
}
