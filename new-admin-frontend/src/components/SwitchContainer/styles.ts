import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    statuscontainer: {
      borderRadius: 20,
      padding: theme.spacing(1),
      height: 36,
      Width: '100%',
      maxWidth: 250,
      display: 'flex',
      gap: theme.spacing(2),
      alignItems: 'center',
      justifyContent: 'center',
      '& .MuiTypography-root': {
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      },
      transition: theme.transitions.create('backgroundColor', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    statustext: {
      fontSize: 14,
    },
    statustrue: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    statusfalse: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      '& .MuiIconButton-root.Mui-disabled': {
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.dark : theme.palette.grey.primary.light,
      },
    },
  })

export default styles
