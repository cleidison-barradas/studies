import styled from 'styled-components'

export const MenuContainer = styled.div`
  width: 100vw;

  @media (min-width: 700px) {
    width: 360px;
  }
`

export const UserContainer = styled.div`
  display: flex;
  width: 100%;
  height: 82px;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  gap: 16px;

  .username {
    color: ${({ theme }) => theme.color.neutral.darkest};
    font-size: ${({ theme }) => theme.text.fontsize.xs};
    font-family: ${({ theme }) => theme.text.fontFamily.primary};
  }

  .useremail {
    color: ${({ theme }) => theme.color.neutral.dark};
    font-family: ${({ theme }) => theme.text.fontFamily.secondary};
    font-size: ${({ theme }) => theme.text.fontsize.xxs};
  }
`

export const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.primary.medium};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`

export const MenuOption = styled.button`
  width: 100%;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  background-color: #fff;
  border-bottom: 1px solid ${({ theme }) => theme.color.neutral.light};

  .title {
    color: ${({ theme }) => theme.color.neutral.darkest};
    font-size: 14px;
    font-family: ${({ theme }) => theme.text.fontFamily.primary};
  }

  .description {
    color: ${({ theme }) => theme.color.neutral.medium};
    font-size: 12px;
    font-family: ${({ theme }) => theme.text.fontFamily.secondary};
  }

  @media (min-width: 700px) {
    .title {
      font-size: ${({ theme }) => theme.text.fontsize.xs};
    }

    .description {
      font-size: ${({ theme }) => theme.text.fontsize.xxs};
    }
  }
`

export const MenuBody = styled.div`
  padding: 16px;

  @media (min-width: 1024px) {
    max-height: 450px;
    overflow-y: auto;
    padding-right: 16px;
  }
`
export const GoBackButton = styled.button`
  width: 100%;
  outline: none;
  border: none;
  margin-bottom: 16px;
  background: white;
  position: relative;
`
export const CategoryBtn = styled.button`
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.neutral.light};
  color: ${({ theme }) => theme.color.neutral.darkest};
  padding: 10px 0px 10px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  font-family: Montserrat;
  font-size: 14px;
`
