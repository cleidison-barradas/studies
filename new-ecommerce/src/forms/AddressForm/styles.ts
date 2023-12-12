import styled from 'styled-components'

export const IconBox = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: ${({theme}) => theme.color.neutral.medium};
    cursor: pointer;
`

export const Label = styled.label`
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: ${({theme}) => theme.text.fontsize.xxs};
    font-family: ${({theme}) => theme.text.fontFamily.secondary};
    color: ${({theme}) => theme.color.neutral.darkest};
    margin: 0 0 10px 0;
`

export const Input = styled.input`
    height: 48px;
    border-radius: 6px;
    border: 1px solid ${({theme}) => theme.color.neutral.medium};
    padding: 0 10px;
`

export const InputContainer = styled.div`
    height: 48px;
    border-radius: 6px;
    border: 1px solid ${({theme}) => theme.color.neutral.medium};
    display: flex;
    padding: 0 8px;

    ${IconBox} {
        width: 40%;
    }
`

export const InnerInput = styled.input`
    width: 60%;
    height: 48px;
    outline: none;
    background-color: transparent;
    border: 0;
`