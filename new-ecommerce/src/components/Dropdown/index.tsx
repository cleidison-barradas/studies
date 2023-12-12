import { TreeView } from '@mui/lab'
import React from 'react'
import { Wrapper } from './styles'

export const Dropdown: React.FC = ({ children }) => {
  return (
    <Wrapper>
      <TreeView className="dropdown-container">{children}</TreeView>
    </Wrapper>
  )
}
