import styled from 'styled-components'

interface LogoProps {
  hidden?: boolean
}

export const Logo = styled('img')<LogoProps>`
  height: 72px;
  width: 72px;
  border-radius: 56px;
  visibility: ${({ hidden }) => (hidden ? 'hidden' : 'visible')};

  transition: visibility 2s ease-in-out;
`
export const MenuButton = styled('button')`
  outline: none;
  background: none;
  border: none;
  color: white;
  position: relative;

  display: flex;
  align-items: center;
  gap: 11px;

  height: 40px;
  padding: 8px;

  font-size: 16px;
  border-radius: 8px;

  letter-spacing: 1.5px;
  line-height: 16px;

  font-family: Poppins;
  font-weight: normal;

  :hover {
    background: ${({ theme }) => theme.color.primary.light};
  }

  :active {
    opacity: 0.5;
  }
`
export const ButtonSubtitle = styled('span')`
  font-size: 14px;
  font-family: Montserrat;
`
export const ButtonIcon = styled('span')`
  position: absolute;
  left: -10px;
  top: -10px;

  .MuiChip-root {
    min-height: 24px;
    min-width: 24px;

    background-color: ${({ theme }) => theme.color.secondary.medium}};
  }
`

export const Container = styled.header`
  width: 100%;
  background-color: ${({ theme, color }) => theme.color.primary.medium};
  box-sizing: border-box;
  padding: 16px;
  max-height: 160px;
  color: ${({ theme }) => theme.color.neutral.lightest};
  z-index: 2;
  top: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    max-height: 171px;
    position: normal;
  }

  @media (min-width: 1279px) {
    height: 88px;
  }
`

export const InnerContainer = styled.div`
  width: 100%;
  max-width: 1224px;
`
