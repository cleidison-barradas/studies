import { Theme, createStyles } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    container: theme.mixins.gutters({
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(5),
      marginBottom: theme.spacing(3),
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        height: 'auto'
      },
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    }),
    header: {
      width: '100%',
      paddingBottom: 10,
      marginBottom: 15,
      borderBottom: '1px solid transparent'
    },
    title: {
      fontSize: 24
    },
    titleCenter: {
      textAlign: 'center'
    }
  })

export default styles
