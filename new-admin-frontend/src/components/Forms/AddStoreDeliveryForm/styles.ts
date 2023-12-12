import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    currencyDiv: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    currencyLabel: {
      position: 'absolute',
      top: -10,
      background: '#fff',
      left: 8,
      padding: '0 5px 0 5px',
      fontSize: 14,
      color: '#999',
    },
    inputs: {
      border: '1px solid #707070',
      height: 41,
      padding: '8px 8px',
      width: '100%',
      borderRadius: 24,
      fontSize: 16,
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        border: '1px solid #5CB9FF',
      },
    },
  })

export default styles
