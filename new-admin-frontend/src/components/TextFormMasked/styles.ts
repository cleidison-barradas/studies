import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    inputdiv: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    labelinput: {
      top: -10,
      left: 8,
      fontSize: 14,
      color: '#999',
      position: 'absolute',
      padding: '0 5px 0 5px',
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    },
    errorlabel: {
      fontSize: 12,
      fontWeight: 400,
      alignSelf: 'center'
    }
  })

export default styles
