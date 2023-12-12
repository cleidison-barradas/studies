import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  headertitle: {
    fontSize: 24,
    color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.light,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center',
    },
    marginBottom: 5
  },

  caption: {
    fontSize: 16,
    color: theme.palette.grey.primary.dark,
  },
})

export default styles
