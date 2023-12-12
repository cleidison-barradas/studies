import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    paperWrap: {
      padding: theme.spacing(1),
      backgroundColor: '#0a3463',
      color: theme.palette.text.primary,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 20,
      height: '100%',
      width: '90%',
      maxHeight: 450,
      maxWidth: 428,
      boxShadow: '5px 25px 30px 5px rgba(0, 0, 0, 0.15)'
    },
    topBar: {
      display: 'flex',
      justifyContent: 'center',
      '& $icon': {
        marginRight: theme.spacing(1)
      }
    },
    brand: {
      marginTop: 54,
      marginBottom: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5px 10px',
      position: 'relative',
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.text.primary,
      textDecoration: 'none',
      '&$outer': {
        color: theme.palette.common.white
      },
      [theme.breakpoints.down('md')]: {
        margin: theme.spacing(2)
      },
      '& img': {
        width: 130,
        height: 25,
        marginRight: 10,
        filter: 'brightness(0) invert(1)'
      }
    }
  })

export default styles
