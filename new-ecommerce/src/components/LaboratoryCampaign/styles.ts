import styled from 'styled-components'

export const ContainerTag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #B7FFCC;
  box-shadow: 0px 24px 40px rgba(57, 57, 57, 0.08);
  border-radius: 8px;
  width: 140px;
  padding: 8px;
  position: relative;
  top: -30px;
  left: 63%;
`

export const CampaignInputLabel = styled.label`
  font-size: 12px;
  font-weight: 400;
  color: #474F57;
  font-family: 'Poppins';
  margin: 5px 0;
`

export const CampaingInput = styled.input`
  width: 100%;
  border: 1px solid #ADB5BD;
  border-radius: 6px;
  padding: 5px;
`

export const CampaignInputPrice = styled.h4`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary.light};
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
