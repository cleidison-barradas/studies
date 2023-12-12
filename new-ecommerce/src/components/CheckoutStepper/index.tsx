import { Box, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { StepColorConnector } from '../StepColorConnector'
import { ColorStepIcon } from '../ColorStepIcon'
import { useTheme } from 'styled-components'
import AuthContext from '../../contexts/auth.context'

interface CheckoutStepperProps {
  step: number
  onClickStep: (step: number) => void
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ step, onClickStep }) => {
  const { color } = useTheme()
  const { user } = useContext(AuthContext)

  return (
    <Box borderBottom={`1px solid ${color.neutral.light}`} pb={3}>
      <Stepper activeStep={step} alternativeLabel connector={<StepColorConnector />}>
        <Step>
          <StepButton disabled={!!user} onClick={() => onClickStep(0)}>
            <StepLabel StepIconComponent={ColorStepIcon}>
              <Typography>Identificação</Typography>
            </StepLabel>
          </StepButton>
        </Step>
        <Step>
          <StepButton disabled={step < 2} onClick={() => onClickStep(1)} >
            <StepLabel StepIconComponent={ColorStepIcon}>
              <Typography>Entregar em</Typography>
            </StepLabel>
          </StepButton>
        </Step>
        <Step>
          <StepButton disabled={step < 4} >
            <StepLabel StepIconComponent={ColorStepIcon}>
              <Typography>Pagamento</Typography>
            </StepLabel>
          </StepButton>
        </Step>
      </Stepper>
    </Box>
  )
}
