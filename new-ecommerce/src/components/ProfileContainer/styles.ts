import styled from 'styled-components'

export const Container = styled.div`
    width: 330px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 700px) {
        width: 500px;
        margin: 30px 0;
    }
`

export const UserContainer = styled.div`
    display: flex;
    width: 100%;
    height: 64px;
    align-items: center;
    margin: 32px 0;

    @media (min-width: 700px) {
        justify-content: center;
    }

    .username {
        color: ${({theme}) => theme.color.neutral.darkest};
        font-size: ${({theme}) => theme.text.fontsize.md};
        font-family: ${({theme}) => theme.text.fontFamily.primary};
    }

    .useremail {
        color: ${({theme}) => theme.color.neutral.dark};
        font-family: ${({theme}) => theme.text.fontFamily.secondary};
    }
`

export const IconContainer = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: ${({theme}) => theme.color.primary.medium};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
`

export const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export const Title = styled.h2`
    font-family: ${({theme}) => theme.text.fontFamily.secondary};
    font-weight: ${({theme}) => theme.text.fontWeight.regular};
    font-size: ${({theme}) => theme.text.fontsize.xl};
    align-self: flex-start;

    @media (min-width: 700px) {
        align-self: center;
    }
`

