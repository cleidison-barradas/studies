import { Stack, Typography } from '@mui/material'
import React, {useState, useEffect} from 'react'
import { CheckIcon } from '../../assets/icons'
import { SPECIAL_CHARACTER_REQUIRED, TWO_DIGIT_REQUIRED, UPPERLETTER_REQUIRED } from '../../helpers/regexes'
import { DotIcon } from './styles'

interface PasswordValidationProps {
    password: string
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({password}) => {
    const [digitOk, setDigitOk] = useState<boolean>(true)
    const [lengthOk, setLengthOk] = useState<boolean>(true)
    const [upperLetterOk, setUpperLetterOk] = useState<boolean>(true)
    const [specialCharOk, setSpecialCharOk] = useState<boolean>(true)

    useEffect(() => {
        setLengthOk(password.length < 8 ? false : true)
        setDigitOk(TWO_DIGIT_REQUIRED.test(password))
        setUpperLetterOk(UPPERLETTER_REQUIRED.test(password))
        setSpecialCharOk(SPECIAL_CHARACTER_REQUIRED.test(password))
    }, [password])

    return(
        <Stack>
            <Stack direction="row" alignItems="center">
                {lengthOk ? <CheckIcon /> : <DotIcon />}
                <Typography ml="2px">Senha precisa conter 8 digitos</Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
                {upperLetterOk ? <CheckIcon /> : <DotIcon />}
                <Typography ml="2px">Use pelo menos uma letra maiúscula</Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
                {specialCharOk ? <CheckIcon /> : <DotIcon />}
                <Typography ml="2px">Use pelo menos um caractere especial</Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
                {digitOk ? <CheckIcon /> : <DotIcon />}
                <Typography ml="2px">Use pelo menos 2 números</Typography>
            </Stack>
        </Stack>
    )
}