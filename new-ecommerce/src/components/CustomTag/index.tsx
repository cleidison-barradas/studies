import React, { ReactNode } from 'react'

import { Tag } from './styles'
import { Stack } from '@mui/material'

interface Props {
  label: string
  border?: string
  block?: boolean
  color: string
  icon?: ReactNode
  background: string
}

const CustomTag: React.FC<Props> = ({
  label = '',
  icon,
  border,
  block = true,
  color,
  background,
}) => {
  return (
    <Tag color={color} block={block} background={background} border={border}>
      <Stack gap="8px" justifyContent="center" alignItems="center" flexDirection="row">
        {icon}
        {label}
      </Stack>
    </Tag>
  )
}

export default CustomTag
