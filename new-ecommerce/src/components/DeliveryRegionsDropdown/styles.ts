import styled from 'styled-components'

interface ContainerProps {
  open: boolean
  mainPage: boolean
}

export const Container = styled.button<ContainerProps>`
  position: absolute;
  top: ${({ mainPage }) => (mainPage ? '160px' : '109px')};
  left: 0;

  width: 100vw;
  height: 40px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-left: 24px;
  padding-right: 24px;

  border: none;
  outline: none;

  font-size: 16px;
  letter-spacing: 1.5px;
  line-height: 16px;

  font-family: Poppins, sans-serif;
  font-weight: normal;

  background-color: ${({ theme }) => theme.color.primary.lightest};

  color: ${({ theme }) => theme.color.neutral.light};

  .arrowIcon {
    transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
  }

  @media (min-width: 900px) {
    position: static;
    color: ${({ theme }) => theme.color.neutral.lightest};
    width: auto;
    background-color: transparent;
    gap: 16px;
    border-radius: 8px;

    :hover {
      background: ${({ theme }) => theme.color.primary.light};
    }

    :active {
      opacity: 0.5;
    }
  }
`

export const PopperContainer = styled.div`
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  padding-bottom: 68px;
  background-color: ${({ theme }) => theme.color.neutral.lightest};
  z-index: 5;
  box-shadow: 2px 6px 21px -2px rgb(0 0 0 / 75%);

  @media (min-width: 900px) {
    width: 360px;
    max-height: 530px;
    border-radius: 24px;
    padding-bottom: 32px;

    height: auto;
  }
`

export const NeighborhoodContainer = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  text-align: left;
  color: ${({ theme }) => theme.color.neutral.dark};
  border: none;
  outline: none;
  background: transparent;
  margin-top: 16px;
`

interface CityProps {
  selected: boolean
}

export const City = styled.button<CityProps>`
  width: 100%;
  border: none;
  padding-left: 12px;
  outline: none;
  background: transparent;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${({ theme, selected }) =>
    selected ? theme.color.primary.medium : theme.color.neutral.dark};
  padding-top: 16px;
  text-align: left;
`

export const LocationContainer = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  margin-top: 26px;

  .MuiTreeItem-content:hover {
    background-color: transparent;
  }

  .container {
    border: 1px solid ${({ theme }) => theme.color.neutral.dark};
    border-radius: 16px;
    padding-bottom: 12px;
    padding-right: 16px;
    margin-bottom: 16px;
  }

  .selected {
    border-color: ${({ theme }) => theme.color.primary.medium};
    color: ${({ theme }) => theme.color.primary.medium};
  }

  .MuiTreeItem-iconContainer {
    width: 0px;
    margin-right: 0px;
  }

  .Mui-selected,
  .Mui-selected:hover {
    background: transparent;
  }

  .Mui-selected.Mui-focused {
    background: transparent;
  }

  @media (min-width: 800px) {
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #ccc;
    }
  }
`
