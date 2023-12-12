import styled from 'styled-components'

export const CategoryText = styled.p`
  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  font-size: ${({ theme }) => theme.text.fontsize.xxs};
  font-style: normal;
  font-weight: normal;

  line-height: 140%;

  color: ${({ theme }) => theme.color.neutral.dark};
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.text.fontsize.xs};
  }
`

export const CategoryContainer = styled.button`
  height: 128px;
  width: 130px;
  min-width: 130px;

  background-color: ${({ theme }) => theme.color.neutral.lightest};

  border-radius: ${({ theme }) => theme.border.radius.lg};
  border: none;

  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding-left: ${({ theme }) => theme.spacing.inline.quarck};
  padding-right: ${({ theme }) => theme.spacing.inline.quarck};
  padding: 8px;
  padding-top: 40px;

  @media (min-width: 768px) {
    box-shadow: 0px 8px 8px rgba(57, 57, 57, 0.08);
    height: 132px;
    width: 152px;
    padding-top: 60px;

    &:hover {
      box-shadow: 0px 8px 8px 0px rgba(0, 0, 0, 0.2);
    }
  }

  &:hover > ${CategoryText} {
    color: ${({ theme }) => theme.color.neutral.darkest};
  }

  &:active {
    box-shadow: none;
  }
`
export const CategoryImageContainer = styled.div`
  position: absolute;
  top: -40px;
  border-radius: 50%;
  height: 80px;
  width: 80px;
  z-index: 1;

  @media (min-width: 768px) {
    height: 120px;
    width: 120px;
    top: -60px;
  }
`
