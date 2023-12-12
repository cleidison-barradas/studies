import styled from 'styled-components'

interface Props {
  color?: string
  border?: string
  block?: boolean
  background?: string
}

export const Tag = styled.span<Props>`
  width: ${({ block }) => (block ? '100%' : 'fit-content')};
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
  border: ${({ border }) => border && `1px solid ` + border};
  color: ${({ color }) => color};
  background: ${({ background }) => background};
  margin-top: 8px;
`
