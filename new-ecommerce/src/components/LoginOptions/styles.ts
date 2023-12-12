import styled from 'styled-components'

interface OptionButtonProps {
  borderColor?: string
  color: string
  background: string
}

export const OptionButton = styled.button<OptionButtonProps>`
  border: ${({ borderColor }) => (borderColor ? `1px solid ${borderColor}` : 'none')};
  color: ${({ color }) => color};
  background: ${({ background }) => background};
  border-radius: 8px;
  height: 56px;
  width: 100%;
  outline: none;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 14px;
  font-weight: 500;
`
