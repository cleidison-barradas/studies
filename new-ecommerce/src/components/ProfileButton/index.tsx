import React from 'react'
import { Typography } from '@mui/material'
import { EditButton, InnerButtonContainer, InnerButtonIcon } from './styles'
import { UserIcon, LocationIcon, ForwardArrowIcon } from '../../assets/icons'
import { useNavigate } from 'react-router'

interface ProfileButtonProps {
    mainText: string
    secondText: string
    typeIs: 'profile' | 'address'
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({mainText, secondText, typeIs}) => {
    const navigate = useNavigate()

    return (
        <EditButton onClick={() => navigate(`/edit/${typeIs}`)}>
            <InnerButtonIcon>
                {typeIs === 'profile' ? <UserIcon /> : <LocationIcon />}
            </InnerButtonIcon>
            <InnerButtonContainer>
                <Typography>{mainText}</Typography>
                <Typography color="#787878">{secondText}</Typography>
            </InnerButtonContainer>
            <InnerButtonIcon>
                <ForwardArrowIcon />
            </InnerButtonIcon>
        </EditButton>
    )
}