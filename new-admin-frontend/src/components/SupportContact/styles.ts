import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  inputcontact: {
    border: 'none',
    fontSize: 18,
    background: 'transparent',
    color: theme.palette.type !== 'dark' ? theme.palette.primary.main : theme.palette.common.white,
  },
  inputlabel: {
    color: theme.palette.type !== 'dark' ? theme.palette.primary.main : theme.palette.common.white,

  }
})

export default styles