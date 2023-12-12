import styled from 'styled-components'

interface DropdownContainerProps {
  color: 'primary' | 'secondary'
}

export const SearchContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 12px;
  overflow-y: auto;
  z-index : 999;
  
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
  font-weight: bold;
  margin-left: 16px;

  color: ${({ theme }) => theme.color.neutral.darkest};
`

export const DropdownContainer = styled.div<DropdownContainerProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme, color }) => theme.color[color].medium};
  border-radius: 30px;
  background-color: ${({ theme }) => theme.color.neutral.lightest};
  max-height: 328px;
  overflow-y: none;
  padding-right: 10px;
  gap: 12px;
`
export const InputContainer = styled.div<InputContainerProps>`
  width: 100%;
  position: relative;
  color: ${({ theme }) => theme.color.neutral.darkest};
  display: flex;
  align-items: center;
  -webkit-transition: color 150ms linear;
  -ms-transition: color 150ms linear;
  transition: color 150ms linear;
`

export const StartIconContainer = styled.div`
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
`

interface InputContainerProps {
  color: 'primary' | 'secondary'
}

export const SearchItem = styled.button`
  background-color: transparent;
  outline: none;
  border: none;
  width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 4px;
  border: 1px solid transparent;

  &:hover {
    background-color: #cdcdcd;
  }

  &:active {
    background-color: transparent;
    border: 1px solid #cdcdcd;
  }
`
interface SearchAvatarProps {
  background: string
}

export const SearchAvatar = styled.div<SearchAvatarProps>`
  height: 24px;
  width: 24px;
  background-image: url(${(props) => props.background});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 4px;
`

export const SearchTitle = styled.div`
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
  letter-spacing: 0.25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
