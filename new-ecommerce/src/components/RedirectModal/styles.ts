import styled from 'styled-components'

export const ModalContainer = styled.div`
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FFF;
    border-radius: 24px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`

export const CloseBox = styled.div`
    display: flex;
    color: ${({theme}) => theme.color.neutral.dark};
    font-size: ${({theme}) => theme.text.fontsize.xxs};
    font-family: ${({theme}) => theme.text.fontFamily.primary};
    cursor: pointer;
`