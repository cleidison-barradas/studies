import * as React from 'react'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import StatusOrder from '../../interfaces/statusOrder'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { IPaymentCode } from '../../interfaces/paymentCode'

const steps = [
  {
    label: 'Pedido Realizado',
    type: 'pending',
  },
  {
    label: 'Pagamento Realizado',
    type: 'payment_made',
  },
  {
    label: 'Pedido Aceito',
    type: 'accepted',
  },
  {
    label: 'Saiu para Entrega',
    type: 'out_delivery',
  },
]

interface Props {
  status: StatusOrder
  paymentCode: IPaymentCode
}

const StatusSteps: React.FC<Props> = ({ status, paymentCode = 'pay_online' }) => {
  const [activeStep, setActiveStep] = React.useState(0)

  useEffect(() => {
    setActiveStep(steps.findIndex((step) => step.type === status.type))
  }, [activeStep, status])

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.filter(_step => {

          if (!paymentCode.includes('pay_online') && _step.type.includes('payment_made')) {

            return false
          }

          return true
        }).map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
        {status.type.includes('delivery_made') ? (
          <Step>
            <StepLabel
              icon={<CheckCircle style={{ fontSize: 24, margin: 0, padding: 0 }} color="success" />}
            >
              Pedido Finalizado
            </StepLabel>
          </Step>
        ) : status.type.includes('rejected') ? (
          <Step>
            <StepLabel
              icon={<Cancel style={{ fontSize: 24, margin: 0, padding: 0 }} color="error" />}
            >
              Pedido Rejeitado
            </StepLabel>
          </Step>
        ) : null}
      </Stepper>
    </Box>
  )
}

export default StatusSteps
