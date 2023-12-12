import { StepConnector, stepConnectorClasses } from '@mui/material'
import styled, { useTheme } from 'styled-components'

export const StepColorConnector = styled(StepConnector)(({ theme }) => {
  const { color } = useTheme()

  return {
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 21,
      color: color.primary.medium,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        background: color.primary.medium,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        background: color.primary.medium,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
      border: 0,
      backgroundColor: color.neutral.light,
      borderRadius: 1,
    },
  }
})
