import styled from 'styled-components'

export const StoreLinkCard = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.neutral.light};
  border-radius: 24px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  text-align: center;
`
