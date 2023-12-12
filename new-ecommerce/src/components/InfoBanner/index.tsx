import { Stack } from '@mui/material'
import React from 'react'
import { Description, IconContainer, InfoCard, Title } from './styles'

interface InfoBannerProps {
  Icon: React.FC
  title?: string
  CustomComponent?: React.ReactNode
  description?: string
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ Icon, title, description, CustomComponent }) => {
  return (
    <InfoCard>
      <Stack gap={3} height="100%" direction="row">
        <IconContainer>{<Icon />}</IconContainer>
        <Stack justifyContent="space-between" gap={2}>
          {title && <Title> {title} </Title>}
          {description && <Description> {description} </Description>}
          {CustomComponent && CustomComponent}
        </Stack>
      </Stack>
    </InfoCard>
  )
}
