import { createStyles } from '@material-ui/core'

const styles = (theme: any) =>
  createStyles({
    headergrid1: {
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2),
      },
    },
    goback: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 36,
      width: 36,
      background: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      borderRadius: 4,
      marginRight: theme.spacing(2),
      boxShadow:
        '0px 1px 5px 0px rgba(80,80,80, 0.2), 0px 2px 2px 0px rgba(80,80,80, 0.14), 0px 3px 1px -2px rgba(80,80,80, 0.12)',
    },
    gobacktext: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.dark,
    },
    header: {
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      marginTop: theme.spacing(4),
    },
    title: {
      marginBottom: theme.spacing(2),
      fontSize: 20,
    },
    imagesrow: {
      display: 'flex',
      alignItems: 'center',
      overflowX: 'auto',
      marginTop: theme.spacing(2),
    },
    image: {
      height: 240,
      width: 240,
      minWidth: 240,
      borderRadius: 20,
      marginRight: theme.spacing(2),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: theme.transitions.create('brightness', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      '&:hover': {
        cursor: 'pointer',
        filter: 'brightness(0.7)',
        '& $deleteicon': {
          opacity: 1,
        },
      },
    },
    deleteicon: {
      opacity: 0,
    },
    uploadertext: {
      textAlign: 'center',
      fontSize: 16,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      marginTop: theme.spacing(2),
    },
  })

export default styles
