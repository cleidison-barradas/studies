import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  exportbtn: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    color: theme.palette.white.light,
    '&:hover': {
      backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
    },
  }
})

export default styles
