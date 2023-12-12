import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  headertitle: {
    fontSize: 24,
    color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.light,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
  exportbtn: {
    marginLeft: 5,
    backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    color: theme.palette.white.light,
    '&:hover': {
      backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
    },
  }
})

export default styles
