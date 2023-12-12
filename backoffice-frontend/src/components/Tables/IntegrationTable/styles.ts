import { createStyles, fade, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  link: {
    textDecoration: 'none',
    cursor: 'pointer'
  },
  textheader: {
    fontWeight: 'bold',
  },
  textinfo: {
    marginLeft: 5
  },
  healty: {
    backgroundColor: theme.palette.green.light,
    color: theme.palette.primary.contrastText,
  },
  warning: {
    backgroundColor: theme.palette.yellow.primary.light,
    color: theme.palette.primary.contrastText,
  },
  critical: {
    backgroundColor: theme.palette.red.light,
    color: theme.palette.primary.contrastText,
  },
  status: {
    backgroundColor:
      theme.palette.type === 'light' ? fade(theme.palette.green.light, 0.15) : fade(theme.palette.green.dark, 0.15),
    color: theme.palette.green.light,
    marginTop: 5,
  }
})

export default styles
