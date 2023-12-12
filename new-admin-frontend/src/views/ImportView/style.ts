import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    gobackbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      height: 36,
      width: 36,
    },
    backroot: {
      minWidth: 0,
      borderRadius: 4,
    },
    gobacktxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    },
    discardbtn: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.light,
    },
  })
export default styles
