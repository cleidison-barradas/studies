import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    cellroot: {
      paddingLeft: 0,
      paddingRight: 0,
      border: 'none',
    },
    rowroot: {
      border: 'none',
    },
    sizesmall: {
      padding: '0px',
    },
    statuscontainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      height: 36,
      width: 135,
    },
    headerstatus: {
      width: 150,
    },
    statustext: {
      color: theme.palette.white.light,
      fontSize: 14,
    },
    statustrue: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    },
    statusfalse: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    },
    buttongroup: {
      marginLeft: 5,
    },
    button: {
      fontWeight: 500,
      fontSize: 14,
      textTransform: 'none',
    },
    buttontext: {
      fontSize: 14,
      fontWeight: 700,
      textTransform: 'none',
    },
    DropdownMenuContent: {
      padding: theme.spacing(2),
    },
    DropdownMenuItem: {
      fontSize: 14,
      textTransform: 'none',
      palette: {
        background: {
          default: '#FFFFFF',
        },
      },
      marginBottom: theme.spacing(1),
      borderRadius: 20,
    },
    statuscell: {},
    deletebtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.red.light : theme.palette.red.dark,
      },
    },
    checkbox: {
      padding: 0,
    },
    selectbtntext: {
      textTransform: 'none',
      fontSize: 14,
    },
    childcell: {},
    tableRoot: {
      overflowX: 'auto',
      minWidth: 'inherit',
    },
    menuBox: {
      marginTop: 45,
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
    },
  })

export default styles
