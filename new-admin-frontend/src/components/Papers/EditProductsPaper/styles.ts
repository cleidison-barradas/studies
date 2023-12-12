import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    backlink: {
      width: 36,
      height: 36,
      backgroundColor: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      borderRadius: 4,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing(2),
    },
    backrow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      justifyContent: 'space-between',
    },
    backtext: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    savebutton: {
      marginLeft: theme.spacing(2),
      paddingLeft: 50,
      paddingRight: 50,
    },
  })

export default styles
