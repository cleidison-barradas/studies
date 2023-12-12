import { Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { decode } from 'html-entities'
import { ReturnButton } from './styles'
import { BackArrowIcon } from '../../assets/icons'
import { useNavigate } from 'react-router'
import useSWR from 'swr'
import { GetStoreAboutUs } from '../../services/aboutus/aboutus.service'
import { AboutUsHelmet } from '../../components/AboutUsHelmet'
import AuthContext from '../../contexts/auth.context'

const AboutUs: React.FC = () => {
  const { data } = useSWR('aboutus', GetStoreAboutUs)
  const navigate = useNavigate()
  const { store } = useContext(AuthContext)
  const isGenericStore = store?.plan.rule.includes('generic')

  return (
    <React.Fragment>
      <AboutUsHelmet />
      <Stack mb={5} alignItems="center" mt={2} direction="row" spacing={2}>
        <ReturnButton onClick={() => navigate('/')}>
          <BackArrowIcon />
        </ReturnButton>
        <Typography variant="h1" color="#616D78" fontSize={{ lg: 30, xs: 18 }}>
          {isGenericStore ? "Saiba mais sobre nossa loja online" : "Saiba mais sobre nossa farmácia online"}
        </Typography>
      </Stack>
      {data?.content && (
        <div
          style={{ width: '100%', lineHeight: 2, overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: decode(data?.content) }}
        />
      )}
    </React.Fragment>
  )
}

export default AboutUs
