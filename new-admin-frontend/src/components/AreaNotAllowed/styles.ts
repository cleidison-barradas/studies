import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  containercontent: {
    width: '100%',
    height: 'auto',
    borderRadius: 20,
    border: '0.5px solid #D8D8D8',
    padding: '10px 5px',
    background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark
  },
  image: {
    maxWidth: 170,
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      maxWidth: 100
    }
  }
})

export default styles