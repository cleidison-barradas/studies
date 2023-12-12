import styled from 'styled-components'

export const GreyButton = styled.button`
    border: 0;
    border-radius: 30px;
    height: 40px;
    width: 156px;
    background-color: ${({theme}) => theme.color.neutral.light};
    font-size: ${({theme}) => theme.text.fontsize.xxs}
`