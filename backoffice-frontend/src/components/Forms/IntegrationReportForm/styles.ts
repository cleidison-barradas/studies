import { Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  caption: {
    color: theme.palette.grey.primary.light,
  },
  select: {
    width: '9rem'
  }
})

export default styles
