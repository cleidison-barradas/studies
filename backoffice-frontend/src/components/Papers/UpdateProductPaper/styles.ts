import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    goback: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 36,
      width: 36,
      background: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      borderRadius: 4,
      marginRight: theme.spacing(2),
      boxShadow:
        '0px 1px 5px 0px rgba(80,80,80, 0.2), 0px 2px 2px 0px rgba(80,80,80, 0.14), 0px 3px 1px -2px rgba(80,80,80, 0.12)',
    },
    gobacktext: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.dark,
    },
  })

export default styles
