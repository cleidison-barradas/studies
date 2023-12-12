import { createStyles, Theme, fade } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    checkboxtext: {
      fontSize: 14,
      textTransform: 'none',
    },
    tableHeadTitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    deletebtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
      color: 'white',
    },
    selectcell: {
      padding: 0,
      paddingBottom: 10,
    },
    headcell: {
      padding: 0,
      paddingBottom: 10,
    },
    btnwrapper: {
      '& .MuiButton-contained:hover': {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.red.dark : theme.palette.red.light,
      },
    },
    checkboxbtn: {
      padding: 0,
      paddingRight: 20,
      '& .MuiIconButton-root': {
        padding: 5,
        left: 2,
        marginRight: 5,
      },
    },
    tablecellroot: {
      padding: 0,
      height: 104,
    },
    avatar: {
      height: 56,
      width: 56,
    },
    name: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    id: {
      fontSize: 14,
      textDecoration: 'none',
      color: theme.palette.type === 'light' ? theme.palette.black.primary.dark : theme.palette.black.primary.light,
    },
    column: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    checkbox: {
      marginLeft: 5,
    },
    table: {
      minWidth: 1200,
    },
    chipsuccess: {
      backgroundColor:
        theme.palette.type === 'light' ? fade(theme.palette.primary.light, 0.15) : fade(theme.palette.primary.dark, 0.15),
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    chipfail: {
      backgroundColor: theme.palette.type === 'light' ? fade(theme.palette.red.light, 0.15) : fade(theme.palette.red.dark, 0.15),
      color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    },
    chippending: {
      backgroundColor: theme.palette.type === 'light' ? fade(theme.palette.warning.light, 0.15) : fade(theme.palette.warning.dark, 0.15),
      color: theme.palette.type === 'light' ? theme.palette.warning.light : theme.palette.warning.dark,
    },
    gotoicon: {
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    loadingcontainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchcontainer: {
      maxWidth: 300,
      width: '100%',
    },
  })
export default styles
