import styled from "styled-components"

export const Button = styled.button`
  border: 0;
  padding: 10px;
  cursor: pointer;
  border-radius: 12px;
  font-family: 'Poppins';
  background: '#E0E8F0';

  :hover {
    background: #DDDDDD;
  }
`

export const CampaignNotFoundImage = styled.div`

.primaryDark {
    fill: ${({ theme }) => theme.color.primary.dark};
  }

  .primaryLight {
    fill: ${({ theme }) => theme.color.primary.light};
  }

  .primaryLightest {
    fill: ${({ theme }) => theme.color.primary.lightest};
  }

  .primaryMedium {
    fill: ${({ theme }) => theme.color.primary.medium};
  }
`
