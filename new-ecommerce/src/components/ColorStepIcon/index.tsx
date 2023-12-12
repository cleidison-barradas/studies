import { StepIconProps } from '@mui/material'
import styled, { useTheme } from 'styled-components'
import { UserIcon, LocationIcon, CardIcon } from '../../assets/icons'

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => {
  const { color } = useTheme()
  return {
    backgroundColor: 'white',
    zIndex: 1,
    color: color.neutral.light,
    width: 42,
    height: 42,
    display: 'flex',
    borderRadius: '50%',
    border: `2px solid ${color.neutral.light}`,
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiStepLabel-label.Mui-active': {
      color: color.primary.medium,
    },
    ...(ownerState.active && {
      color: color.primary.medium,
      borderColor: color.primary.medium,
    }),
    ...(ownerState.completed && {
      color: color.primary.medium,
      borderColor: color.primary.medium,
    }),
  }
})

export function ColorStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement } = {
    1: <UserIcon />,
    2: <LocationIcon />,
    3: <CardIcon />,
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}
