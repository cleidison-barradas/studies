import { Box, IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { CopyIcon } from '../../assets/icons'

interface BoletoInfoProps {
  barcodeUrl: string
  paycode: string
  pdfUrl: string
}

export const BoletoInfo: React.FC<BoletoInfoProps> = ({ barcodeUrl, paycode, pdfUrl }) => {
  const [copied, setCopied] = useState(false)

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack spacing={1}>
        <Typography textAlign="center">Pague usando o código de barras</Typography>
        <img src={barcodeUrl} alt="barcode" />
      </Stack>
      <Stack spacing={1}>
        <Typography textAlign="center" fontSize={14}>
          Ou use a linha digitavel
        </Typography>
        <TextField
          value={paycode}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={async () => {
                    await navigator.clipboard.writeText(paycode)
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
      <Typography>
        Se preferir,
        <Link ml={1} download target="_blank" rel="noopener noreferrer" href={pdfUrl}>
          baixe o boleto em PDF.
        </Link>
      </Typography>
    </Stack>
  )
}
