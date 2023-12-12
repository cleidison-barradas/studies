import styled from 'styled-components'

export interface SocialButtonProps {
  google?: boolean
  facebook?: boolean
  apple?: boolean
  onClick?: VoidFunction
}

export const Button = styled.button<SocialButtonProps>`
  height: 40px;
  background-color: ${({ google, facebook, theme }) =>
    google ? theme.color.neutral.lightest : facebook ? '#1877F2' : '#000000'};
  color: ${({ google, theme }) => (google ? '#000000AA' : theme.color.neutral.lightest)};

  display: flex;
  justify-content: center;
  align-items: center;
  border: ${({ google }) => (google ? '1px solid #E0E8F0' : 0)};
  border-radius: 8px;
  padding: 8px;
  gap: 8px;
`
