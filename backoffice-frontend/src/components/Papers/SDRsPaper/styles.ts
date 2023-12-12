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
  btn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(3),
  }
})

export default styles
