import styled from 'styled-components'

export const SearchContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
  padding-right: 12px;
  max-height: 350px;
  overflow-y: auto;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-top: 8px;

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
`
export const SearchCaption = styled.div`
  font-size: 14px;
  letter-spacing: 0.1px;

  color: ${({ theme }) => theme.color.neutral.darkest};
`

export const Arrow = styled.div`
  width: 0px;
  height: 0px;
  z-index: 13px;
  margin-top: -5px;
  margin-left: 5%;
  display: block;
  position: absolute;
  border-bottom: 18px solid #FFF;
  border-left: 21px solid transparent;
  border-right: 20px solid transparent;
`
