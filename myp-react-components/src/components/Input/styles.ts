import styled from 'styled-components'

interface InputProps {
  size: 'large' | 'medium'
}

const sizeToPx = {
  large: '60px',
  medium: '36px',
}

export const StartIconContainer = styled.div<InputContainerProps>`
  margin-left: 16px;
  margin-right: 16px;
  left: 16px;
  height: 18px;
  width: 18px;
  color: ${({ theme, color }) => theme.color[color].medium};
`

export const Input = styled.input`
  height: ${({ size }: InputProps) => sizeToPx[size]};
  width: 100%;
  outline: none;
  border-radius: 30px;
  background-color: transparent;
  box-sizing: border-box;
  border: none;
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

interface InputContainerProps {
  color: 'primary' | 'secondary'
}

export const InputContainer = styled.div<InputContainerProps>`
  position: relative;
  color: ${({ theme }) => theme.color.neutral.darkest};
  display: flex;
  align-items: center;
  -webkit-transition: color 150ms linear;
  -ms-transition: color 150ms linear;
  transition: color 150ms linear;
  border: 1px solid ${({ color, theme }) => theme.color[color].medium};
  border-radius: 30px;
  width: 100%;
  background: ${({ theme }) => theme.color.neutral.lightest};
`
