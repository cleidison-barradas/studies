import styled from 'styled-components'

interface ISearchOption {
  highLight: boolean
}

export const Wrapper = styled.form`
  width: 100%;

  .MuiOutlinedInput-root {
    border: none;
    border-bottom: none;
    border-radius: 30px;
    outline: none;
    background: white;
  }

  .MuiAutocomplete-input {
    padding-left: 16px !important;
  }

  .MuiAutocomplete-input::placeholder {
    color: black;
  }

  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border: none;
    border-bottom: none;
  }
`
export const IconWrapper = styled.span`
  width: 16px;
  height: 16px;
  margin-left: 16px;
  color: ${({ theme }) => theme.color.primary.medium};
`

export const SuggestIconWrapper = styled.span`
  width: 2px;
  height: 2px;
`

export const SearchAvatar = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 4px;
  object-fit: cover;
`

export const SearchSuggestContianer = styled.li``

export const SearchSuggestOption = styled.span<ISearchOption>`
  color: #474F57;
  font-weight: ${({ highLight }) => highLight ? 400 : 700};

`
export const SearchSuggestItem = styled.button`
  background-color: transparent;
  outline: none;
  border: none;
  width: 100%;
  padding: 4px;
  display: flex;
  align-items: center;
`
