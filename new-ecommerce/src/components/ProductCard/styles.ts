import styled from 'styled-components'

export const ProductImageWrapper = styled.div`
  width: 100%;
  height: 140px;

  border: 1px solid ${({ theme }) => theme.color.neutral.light};
  transition: border-color 200ms;
  border-radius: 16px;
  position: relative;
`

interface ProductImageProps {
  isExample?: boolean
}

interface ProductImageProps {
  src: string
}

export const ProductImage = styled.img<ProductImageProps>`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  padding: ${({ isExample }) => (isExample ? '0px' : '8px')};
  object-fit: ${({ isExample }) => (isExample ? 'cover' : 'contain')};
`

export const ProductContainer = styled.div`
  width: 100%;
  max-width: 180px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: transparent;
  outline: none;
  border: none;
  text-align: left;

  @media (min-width: 800px) {
    width: 216px;
    max-width: 216px;
    min-height: 416px;
    padding: 8px;
    border-radius: 16px;

    :hover {
      box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.2);
    }
  }

  button {
    min-height: 32px;
  }
`

interface DiscountTagProps {
  top?: string
  left?: string
}

export const DiscountTag = styled.span<DiscountTagProps>`
  position: absolute;
  top: ${({ top }) => (top ? top : '8px')};
  left: ${({ left }) => (left ? left : '8px')};

  color: ${({ theme }) => theme.color.feedback.approve.darkest};
  background: ${({ theme }) => theme.color.feedback.approve.lightest};

  padding: 3px;
  padding-left: 8px;
  padding-right: 8px;

  border-radius: 500px;

  font-size: 14px;
  font-weight: 500;
`

interface TagProps {
  color?: string
  background?: string
}

export const Tag = styled.span<TagProps>`
  width: 100%;
  border-radius: 500px;

  font-weight: 500;
  font-size: 14px;
  line-height: 120%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 3px;
  padding-left: 8px;
  padding-right: 8px;

  color: ${({ color }) => color};
  background: ${({ background }) => background};

  margin-top: 8px;
`
export const ControledWarning = styled.span`
  background-color: ${({ theme }) => theme.color.feedback.error.medium};
  width: 100%;
  height: 32px;
  border-radius: 500px;
  color: white;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  text-align: center;

  @media (min-width: 600px) {
    height: 56px;
    border-radius: 500px;
  }
`
