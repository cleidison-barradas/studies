import styled from 'styled-components'

interface ProductCardProps {
  color?: 'neutral' | 'secondary'
}

export const ProductCard = styled.div<ProductCardProps>`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-top: 31px;
  border-bottom: 1px solid
    ${({ theme, color = 'neutral' }) =>
      color === 'neutral' ? theme.color.neutral.light : theme.color.secondary.dark};
  padding-bottom: 24px;
`

export const ProductImageContainer = styled.div`
  position: relative;
`

export const CupomTag = styled.span`
  padding: 2px;
  border-radius: 20px;
  color: ${({ theme }) => theme.color.primary.medium};
  font-size: 16px;
  position: absolute;
  top: -4px;
  left: 2px;
`

interface ProductImageProps {
  color?: 'neutral' | 'secondary'
}

export const Header = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px;

  .price {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #474f57;
  }

  .content,
  .info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .manufaturer {
    color: #adb5bd;

    strong {
      color: #474f57;
    }
  }
`

export const Footer = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 16px;
`

export const ProductImage = styled.img<ProductImageProps>`
  height: 120px;
  width: 120px;

  object-fit: cover;
  margin-right: 8px;
  border: 1px solid
    ${({ theme, color = 'neutral' }) =>
      color === 'neutral' ? theme.color.neutral.light : theme.color.secondary.dark};
  padding: 2px;
  border-radius: 8px;
`

export const ProductName = styled.p`
  max-width: 187px;
  font-size: inherit;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 1000px) {
    max-width: 1000px;
    width: 80%;
  }
`

export const RemoveBtn = styled.button`
  border: none;
  outline: none;
  color: #000000;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: transparent;
`
