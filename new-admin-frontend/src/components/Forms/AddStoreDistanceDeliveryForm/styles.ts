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
      fontSize: 16,
      color: '#999',
    },
    inputs: {
      border: '1px solid #707070',
      height: 35,
      padding: '8px 8px',
      width: '100%',
      borderRadius: 24,
      fontSize: '100%',
      marginBottom: '10px',
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        border: '1px solid #5CB9FF',
      },
    },
    sliderCirculation: {
      borderRadius: '1%',
      padding: '8px 8px',
      margin: '5px',
      marginLeft: '1px',
    },
    customNumberField: {
      outline: 'none',
      boxShadow: 'none',
    },
    sliderRoot: {
      position: 'relative',
      width: '100%',
      height: 2,
    },
    sliderRail: {
      position: 'absolute',
      width: '100%',
      height: 2,
      backgroundColor: theme.palette.action.disabledBackground,
    },
    sliderTrack: {
      position: 'absolute',
      height: 2,
      backgroundColor: theme.palette.primary.main,
    },
    caption: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
  })

export default styles