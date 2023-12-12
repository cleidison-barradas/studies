import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
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
      height: 340,
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
      fontSize: 14,
      marginLeft: 5
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
    iconhelp: {
      fontSize: 16,
      color: '#B8C5D0',
      marginLeft: 5,
    },
  })

export default styles
