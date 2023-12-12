import styled from 'styled-components'

import { FastDeliveryProps } from './model'

export const FastDeliveryContainer = styled.div<FastDeliveryProps>`
  width: 100%;
  flex-direction: column;
  border: 1px solid ${({ pallete, active }) => (active ? pallete.primary?.medium : '#7A828A')};
  cursor: pointer;

  gap: 16px;
  padding: 8px;
  border-radius: 16px;
  transition: all 0.15s;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #7a828a;
  align-items: flex-start;

  &,
  div {
    display: flex;
  }

  div {
    align-items: center;
  }

  > div:nth-child(2) {
    max-width: 87px;
    display: block;
  }

  > span {
    max-width: ${({ isFree }) => (isFree ? 165 : 100)}px;
    margin-right: auto;
  }

  > div:first-child {
    width: 100%;
    justify-content: space-between;

    &,
    div {
      color: ${({ pallete, active }) => (active ? pallete?.primary?.medium : '#7A828A')};
      gap: 8px;
    }

    span {
      color: #7a828a;
      font-weight: 400;
    }
  }

  footer {
    display: flex;
    flex-direction: column;

    p {
      color: #adb5bd;
    }

    span {
      color: #474f57;
    }
  }
`
