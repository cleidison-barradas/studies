import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    divwithfile: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    divwithoutfile: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    },
    caption: {
      fontSize: 14,
      marginBottom: theme.spacing(2),
    },
    link: {
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      textDecoration: 'none',
      fontWeight: 500,
    },
    dropzonecontainer: {
      height: 240,
      width: '100%',
      marginBottom: 20
    },
    dropzonecaption: {
      fontSize: 16,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    docname: {
      marginLeft: theme.spacing(1),
      fontSize: 14,
    },
    docbtn: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      marginTop: theme.spacing(2),
    },
    row2: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    text: {
      fontSize: 14,
    },
    textbold: {
      fontWeight: 'bold',
    },
  })

export default styles
