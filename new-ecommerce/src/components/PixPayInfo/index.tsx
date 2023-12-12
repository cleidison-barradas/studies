import { Stack, Typography, Box, TextField, InputAdornment, IconButton } from '@mui/material'
import React, { useState } from 'react'
import { CopyIcon } from '../../assets/icons'

interface PixPayInfoProps {
  qrcodeSrc: string
  code: string
}

export const PixPayInfo: React.FC<PixPayInfoProps> = ({ qrcodeSrc, code }) => {
  const [copied, setCopied] = useState(false)

  return (
    <Stack spacing={1}>
      <Typography textAlign="center" fontSize={16}>
        Escaneie o QR code
      </Typography>
      <Box alignSelf="center" justifySelf="center">
        <img src={qrcodeSrc} alt="qrcode pix" />
      </Box>
      <Typography textAlign="center" fontSize={14}>
        ou use a chave pix!
      </Typography>
      <TextField
        value={code}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={async () => {
                  await navigator.clipboard.writeText(code)
                  setCopied(true)
                }}
                color="primary"
              >
                <CopyIcon width={24} height={24} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled
        fullWidth
      />
      {copied && (
        <Box>
          <Typography color="green" textAlign="center">
            Chave copiada!
          </Typography>
        </Box>
      )}
      <Typography fontSize={12} variant="subtitle1">
        Depois cole no seu App do banco para finalizar o processo.
      </Typography>
    </Stack>
  )
}
