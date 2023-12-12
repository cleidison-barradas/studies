
import { createStyles } from '@material-ui/core'

const styles = (theme: any) => createStyles({
  headertxt: {
    fontSize: 24,
    color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    padding: '44px 0px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.18px',
  },
  grid: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column-reverse',
      marginBottom: '0px'
    },
  },
  saveButton: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    fontSize: 14,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: '24px'
    },
  },
  boxContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  }
})

export default styles