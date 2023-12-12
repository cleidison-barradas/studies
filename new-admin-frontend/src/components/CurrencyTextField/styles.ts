import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    divcontaier: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    currencylabel: {
      left: 8,
      top: -10,
      fontSize: 14,
      color: '#999',
      position: 'absolute',
      padding: '0 5px 0 5px',
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    },
  })

export default styles
