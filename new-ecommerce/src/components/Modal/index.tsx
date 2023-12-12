import { Dialog } from '@mui/material'
import React from 'react'

interface ModalProps {
  open: boolean
  onClickAway: () => void
}

export const Modal: React.FC<ModalProps> = ({ open, onClickAway, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClickAway}
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: '30px',
          '@media (max-width : 800px)': {
            width: '100vw',
            margin: 0,
            position: 'absolute',
            bottom: 0,
            padding: 1,
            borderRadius: '30px 30px 0px 0px',
          },
        },
      }}
    >
      {children}
    </Dialog>
  )
}
