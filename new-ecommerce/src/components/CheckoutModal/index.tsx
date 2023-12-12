import { useTheme } from 'styled-components'
import { Button, Dialog, Stack, Typography, Slide } from '@mui/material'
import React from 'react'
import { ModalContainer, ModalIconContainer } from './styles'
import { CloseIcon } from '../../assets/icons'
import { TransitionProps } from '@mui/material/transitions'

interface CheckoutModalProps {
  icon?: React.ReactNode
  onClose: () => void
  open: boolean
  disableClose?: boolean
}

const Transition = React.forwardRef(function transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  children,
  icon,
  onClose,
  open,
  disableClose,
}) => {
  const { color } = useTheme()
  return (
    <Dialog
      TransitionComponent={Transition}
      PaperComponent={ModalContainer}
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={!disableClose ? onClose : undefined}
    >
      <div>
        <Stack mb={1} direction="row" justifyContent="space-between" alignItems="center">
          <ModalIconContainer>{icon}</ModalIconContainer>
          {!disableClose && (
            <Button style={{ textTransform: 'none' }} onClick={onClose}>
              <Typography
                gap={1}
                display="flex"
                fontSize={14}
                fontWeight={500}
                color={color.neutral.dark}
              >
                Fechar <CloseIcon width={24} height={24} />
              </Typography>
            </Button>
          )}
        </Stack>
        {children}
      </div>
    </Dialog>
  )
}
