import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    input: {
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    },
    searchbutton: {
      marginLeft: 5,
    },
  })

export default styles
