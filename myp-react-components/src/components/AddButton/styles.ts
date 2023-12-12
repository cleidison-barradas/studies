import styled from 'styled-components'

interface ContainerProps {
  color: 'primary' | 'secondary'
  disabled: boolean
  maxWidth?: boolean
}

export const Container = styled.div<ContainerProps>`
  height: 40px;
  width: ${({ maxWidth }) => (maxWidth ? '100%' : '124px')};

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  border-radius: ${({ theme }) => theme.border.radius.pill};
  border: 1px solid
    ${({ theme, color, disabled }) =>
      color === 'primary'
        ? disabled
          ? theme.color.neutral.medium
          : theme.color.neutral.darkest
        : 'transparent'};

  padding-left: 8px;
  padding-right: 8px;
  padding-top: 5px;
  padding-bottom: 5px;

  color: ${({ color, theme, disabled }) =>
    color === 'primary'
      ? disabled
        ? theme.color.neutral.medium
        : theme.color.neutral.darkest
      : '#FFFFFF'};

  font-size: ${({ color }) => (color === 'primary' ? '14px' : '22px')};
`

export interface RoundButtonProps {
  color: 'primary' | 'secondary'
  btnType: 'add' | 'remove'
}

export const RoundButton = styled.button<RoundButtonProps>`
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.pill};
  font-size: inherit;

  height: 30px;
  width: 30px;

  background: ${({ color, btnType, theme }) =>
    color === 'primary'
      ? 'transparent'
      : btnType === 'add'
      ? theme.color.feedback.approve.medium
      : theme.color.feedback.error.medium};

  color: inherit;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${({ color, btnType, theme }) =>
      color === 'primary'
        ? theme.color.neutral.light
        : btnType === 'add'
        ? theme.color.feedback.approve.darkest
        : theme.color.feedback.error.darkest};
  }

  &:disabled {
    background: ${({ theme, color }) =>
      color === 'secondary'
        ? theme.color.neutral.light
        : theme.color.neutral.lightest};
    color: ${({ theme }) => theme.color.neutral.light};
  }
`

interface InputProps {
  color: 'primary' | 'secondary'
}

export const Input = styled.input<InputProps>`
  background: ${({ theme, color }) =>
    color === 'secondary' ? theme.color.neutral.darkest : 'transparent'};
  outline: none;
  border: none;

  height: 30px;
  width: 30px;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  border-radius: ${({ theme }) => theme.border.radius.pill};

  color: inherit;

  &:disabled {
    background: ${({ theme, color }) =>
      color === 'secondary' && theme.color.neutral.light};
  }
`
