import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
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

    bannerContainer: {
      border: 'none',
      position: 'relative',
      overflow: 'hidden',
      transition: theme.transitions.create('brightness', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      '&:hover': {
        cursor: 'pointer',
        '& $overlay': {
          opacity: 1,
        },
        '& $bannerActionIcon': {
          zIndex: 10,
          opacity: 1,
        },
        '& $bannerActionText': {
          opacity: 1,
        },
      },
    },
    overlay: {
      width: '100%',
      height: '100%',
      opacity: 0,
      position: 'absolute',
      transition: 'all 0.15s',
      backgroundColor: '#0009',
    },
    subtitle: {
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
      margin: 0,
    },
    caption: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      fontSize: 12,
    },
    fileContainer: {
      width: '100%',
      height: 140,
      border: `1px dashed ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      padding: 20,
      '&:hover': {
        cursor: 'pointer',
      },
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      gap: 8,
      marginBottom: 8,
    },
    bannerActionText: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: '14px',
      zIndex: 2,
      margin: 0,
      transition: 'all 0.15s',
      opacity: 0,
      lineHeight: '24px',
      color: '#FFFFFF',
    },
    dragAccepted: {
      borderColor: theme.palette.green.light,
      color: theme.palette.green.light,
    },

    dragReject: {
      borderColor: theme.palette.red.light,
      color: theme.palette.red.light,
    },
    fileInput: {
      opacity: 0,
      zIndex: -1,
      width: 0.1,
      height: 0.1,
    },
    bannerActionIcon: {
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    fileText: {
      fontSize: 16,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
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
  })

export default styles
