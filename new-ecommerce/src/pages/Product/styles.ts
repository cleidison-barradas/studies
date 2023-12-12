import styled from 'styled-components'

export const ProductImageContainer = styled.div`
  max-height: 328px;
  width: 100%;
  position: relative;
  border-radius: 24px;

  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 800px) {
    height: 608px;
  }
`

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 24px;
  // border : 1px solid ${({ theme }) => theme.color.neutral.light}

  @media (max-width: 1200px) {
    max-height: 300px;
  }
`

export const ProductName = styled.h1`
  color: ${({ theme }) => theme.color.neutral.darkest};
  font-size: 18px;
  font-weight: 500;
  line-height: 120%;
  word-break: break-word;
`
export const ProductApresentation = styled.h3`
  font-size: 14px;
  color: ${({ theme }) => theme.color.neutral.medium};
  font-weight: 500;
`
export const ProductPrice = styled.h4`
  font-size: 24px;
  font-weight: bold;

  color: ${({ theme }) => theme.color.neutral.darkest};
`
export const ProductPromotionalPrice = styled.p`
  text-decoration: line-through;
  font-size: 16px;
  color: ${({ theme }) => theme.color.neutral.darkest};
`
export const Caption = styled.p`
  font-size: 14px;
  line-height: 144%;
  color: ${({ theme }) => theme.color.neutral.dark};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const DesktopCard = styled.div`
  border: 1px solid ${({ theme }) => theme.color.neutral.light};
  border-radius: 24px;
  padding: 16px;
  background: white;

  @media (max-width: 1199px) {
    border: 0px;
    border-radius: 0px;
    padding: 0px;
  }
`
export const WhatsappButton = styled.a`
  background-color: ${({ theme }) => theme.color.feedback.approve.medium};
  border-radius: 500px;
  height: 56px;
  width: 100%;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  color: white;

  :hover {
    background-color: ${({ theme }) => theme.color.feedback.approve.dark};
  }
`
export const DisclaimerCard = styled.span`
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.color.neutral.light};
  font-size: 10px;

  color: ${({ theme }) => theme.color.neutral.medium};
  padding: 8px;
  text-align: center;
`
export const ReturnButton = styled.button`
  outline: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.primary.medium};
  position: relative;
  height: 40px;
  min-height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 50%;
  padding: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: white;

  :hover {
    color: white;
    background: ${({ theme }) => theme.color.primary.medium};
  }

  :active {
    opacity: 0.5;
  }
`

export const DescriptionContainer = styled.div`
  overflow: auto;
`
