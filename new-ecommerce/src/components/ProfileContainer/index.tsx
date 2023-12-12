import React, { useContext } from 'react'
import { Typography } from '@mui/material'
import { Container, Title, UserContainer, IconContainer, InfoContainer } from './styles'
import { ProfileButton } from '../../components/ProfileButton'
import { UserIcon } from '../../assets/icons'
import AuthContext from '../../contexts/auth.context'

export const ProfileContainer: React.FC = () => {
    const { user } = useContext(AuthContext)

    return (
        <Container>
            <Title>Sua conta</Title>
            <UserContainer>
                <IconContainer>
                    <UserIcon color="#FFF" />
                </IconContainer>
                <InfoContainer>
                    <Typography className="username">{user?.firstname}</Typography>
                    <Typography className="useremail">{user?.email}</Typography>
                </InfoContainer>
            </UserContainer>
            <ProfileButton
                typeIs="profile"
                mainText="Editar seus dados"
                secondText="Minhas informações pessoais"
            />
            <ProfileButton
                typeIs="address"
                mainText="Seus endereços"
                secondText="Endereços salvos"
            />
        </Container>
    )
}