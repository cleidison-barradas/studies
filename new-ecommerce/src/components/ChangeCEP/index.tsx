import { Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import { formatCEP } from '../../helpers/formatCEP'
import { GreyButton } from './style'

interface ChangeCepProps {
    cep: string
    onClick: VoidFunction
}

export const ChangeCEP: React.FC<ChangeCepProps> = ({cep, onClick}) => {
    const theme = useTheme()
    return (
        <Stack direction="row" justifyContent="space-between" width="100%">
            <Stack>
                <Typography fontSize="14px">Entregas para o CEP:</Typography>
                <Typography color={theme.palette.text.primary}>{formatCEP(cep)}</Typography>
            </Stack>
            <GreyButton onClick={onClick}>Alterar CEP</GreyButton>
        </Stack>
    )
}
