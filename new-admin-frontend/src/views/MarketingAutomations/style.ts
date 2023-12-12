import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    },
    linkprimary: {
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      fontSize: 14,
    },
    link: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      fontSize: 14,
    },
  })

export default styles
