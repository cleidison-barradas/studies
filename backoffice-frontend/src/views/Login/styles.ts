import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      zIndex: 1,
      position: 'relative',
      backgroundColor: '#ffffff',
      height: '100%',
      padding: '5%'
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '60%',
      borderRadius: '20px',
      backgroundColor: '#1999F9',
      [theme.breakpoints.down('md')]: {
        overflow: 'hidden'
      }
    },
    userFormWrap: {
      width: '94%',
      height: 500,
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      top: '30%',
      [theme.breakpoints.up('md')]: {
        width: 428
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(3)
      }
    }
  })

export default styles
