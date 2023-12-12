import React from 'react'
import { Tooltip } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

interface HelpTooltipProps {
  text: string
}

function HelpTooltip({ text }: HelpTooltipProps) {
  return (
    <Tooltip title={text}>
      <HelpOutlineIcon />
    </Tooltip>
  )
}

export default HelpTooltip
