import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      fontSize: 14,
      fontWeight: 'bold',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },

    config: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginBottom: 16,
    },

    subtitle: {
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
      margin: 0,
    },

    section: {
      marginTop: 20,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },

    caption: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      fontSize: 12,
    },

    row: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      marginTop: 15,
    },

    fileContainer: {
      width: '100%',
      height: 140,
      border: `1px dashed ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'column',
      padding: 20,
      '&:hover': {
        cursor: 'pointer',
      },
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      marginBottom: 20,
    },
    fileContainerButton: {
      width: '100%',
      height: 140,
      border: `1px dashed ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'column',
      padding: 20,
      '&:hover': {
        cursor: 'pointer',
      },
      background: 'transparent',
    },
    overflow: {
      maxHeight: 1100,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    logoContainer: {
      width: 140,
      height: 140,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '100%',
      flexDirection: 'column',
      padding: 20,
      '&:hover': {
        cursor: 'pointer',
      },
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },

    trashIcon: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      opacity: 0,
      padding: 10,
      borderRadius: 8,
      transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    fileText: {
      fontSize: 16,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },

    fileInput: {
      opacity: 0,
      zIndex: -1,
      width: 0.1,
      height: 0.1,
    },

    textField: {
      borderRadius: '4px 0px 0px 4px',
      height: 56,
      width: '90%',
      outline: 'none',
      border: `1px solid  ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
      borderRight: '0px',
      background: 'transparent',
      padding: 20,
      fontSize: 18,
    },

    colorInput: {
      border: 'none',
      outline: 'none',
      webkitAppearance: 'none',
      height: 57,
      width: '10%',
      minWidth: 56,
      '&::-webkit-color-swatch-wrapper': {
        padding: 0,
      },
      '&::-webkit-color-swatch': {
        border: 'none',
        padding: 0,
      },
    },

    logoDragAccepted: {
      boxShadow: `0px 0px 5px 5px rgba(0,191,145,0.3)`,
    },

    logoDragRejected: {
      boxShadow: `0px 0px 5px 5px rgba(231,34,34,0.3)`,
    },

    dragAccepted: {
      borderColor: theme.palette.green.light,
      color: theme.palette.green.light,
    },

    dragReject: {
      borderColor: theme.palette.red.light,
      color: theme.palette.red.light,
    },

    loadingcontainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    customLink: {
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      cursor: 'pointer',
      textDecoration: 'underline',
      textTransform: 'capitalize',
    },

    customLinkContainer: {
      display: 'flex',
      paddingTop: 15,
      paddingBottom: 15,
    },
  })

export default styles
