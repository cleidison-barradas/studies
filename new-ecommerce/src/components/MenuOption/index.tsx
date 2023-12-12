import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useTheme } from 'styled-components'
import { ForwardArrowIcon } from '../../assets/icons'
import { MenuButton } from './styles'

interface MenuOptionProps {
  onClick: () => void
  title: string
  description: string
  icon: React.ReactNode
}

export const MenuOption: React.FC<MenuOptionProps> = ({ onClick, title, description, icon }) => {
  const { color } = useTheme()

  return (
    <MenuButton onClick={onClick}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {icon}
        <Stack alignItems="flex-start">
          <Typography className="title" fontSize={18}>
            {title}
          </Typography>
          <Typography className="description" color={color.neutral.medium}>
            {description}
          </Typography>
        </Stack>
      </Stack>
      <ForwardArrowIcon />
    </MenuButton>
  )
}
