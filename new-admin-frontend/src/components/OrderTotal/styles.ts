import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    value: {
      fontSize: 14,
      '@media print': {
        fontWeight: 'bold !important',
      },
    },
  })

export default styles
