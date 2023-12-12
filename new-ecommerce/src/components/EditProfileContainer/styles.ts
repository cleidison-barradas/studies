import styled from 'styled-components'

export const Container = styled.div`
    width: 330px;
    text-align: center;

    @media (min-width: 700px) {
        width: 500px;
        margin: 30px 0;
    }

    @media (min-width: 900px) {
        width: 670px;
        margin: 30px 0;
    }
`

export const Label = styled.label`
    font-size: ${({theme}) => theme.text.fontsize.xs};
    font-family: ${({theme}) => theme.text.fontFamily.primary};
    color: ${({theme}) => theme.color.neutral.darkest};
`
export const Input = styled.input`
    height: 48px;
    width: 100%;
    outline: none;
    border-radius: 8px;
    background-color: transparent;
    box-sizing: border-box;
    margin: 8px 0;
    border: 1px solid #ADB5BD;
    -webkit-transition: color 150ms linear;
    -ms-transition: color 150ms linear;
    transition: color 150ms linear;
    padding-left: 8px;
    &::placeholder {
    color: #787878;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.25px;
    }
`