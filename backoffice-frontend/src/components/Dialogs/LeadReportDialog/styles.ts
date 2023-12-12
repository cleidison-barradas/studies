import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    dialogContentRoot: {
      overflowY: 'hidden',
    },
    labels: {
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.light,
    },
  })

export default styles
