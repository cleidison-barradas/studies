import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      '& .MuiInput-root': {
        border: 'none',
      },
      '& .MuiSelect-root': {
        borderBottom: `1px solid`,
      },
      '& .MuiInput-input': {
        padding: 5,
      },
    },
    light: {
      '& .MuiSelect-root': {
        borderBottomColor: theme.palette.white.light,
        color: theme.palette.white.light,
      },
    },
    dark: {
      '& .MuiSelect-root': {
        color: theme.palette.black.primary.main,
        borderBottomColor: theme.palette.black.primary.main,
      },
    },
  })

export default styles
