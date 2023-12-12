import styled from 'styled-components'

import { CheckboxProps } from './model'

export const CheckboxStyled = styled.div<CheckboxProps>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  transition: all 0.15s;
  border: 1px solid ${({ pallete, checked }) => (checked ? pallete.primary.medium : '#adb5bd')};

  svg {
    opacity: ${({ checked }) => (checked ? 1 : 0)};
  }
`
