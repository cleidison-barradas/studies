import { createStyles, fade, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  title: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  status: {
    backgroundColor:
      theme.palette.type === 'light' ? fade(theme.palette.green.light, 0.15) : fade(theme.palette.green.dark, 0.15),
    color: theme.palette.green.light,
    marginTop: 10,
  }
})

export default styles