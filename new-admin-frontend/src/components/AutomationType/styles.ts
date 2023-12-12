import { createStyles, fade, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      color: 'transparent',
    },
    name: {
      fontSize: 20,
    },
    description: {
      fontSize: 14,
      height: 60,
    },
    link: {
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      textDecoration: 'none',
    },
    sectiontitle: {
      fontSize: 20,
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.primary.light,
    },
    container: {
      minHeight: 186,
    },
    online: {
      backgroundColor:
        theme.palette.type === 'light' ? fade(theme.palette.green.dark, 0.15) : fade(theme.palette.green.light, 0.15),
      color: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    },
    offline: {
      backgroundColor: theme.palette.type === 'light' ? fade(theme.palette.red.dark, 0.15) : fade(theme.palette.red.light, 0.15),
      color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    },
    channel: {
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
    channeltext: {
      fontSize: 14,
      marginTop: 4,
    },
    linkbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      boxSizing: 'border-box',
      borderRadius: 20,
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      textTransform: 'uppercase',
      textDecoration: 'none',
    },
    chipprimary: {
      backgroundColor:
        theme.palette.type === 'light' ? fade(theme.palette.primary.light, 0.15) : fade(theme.palette.primary.main, 0.15),
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      marginRight: theme.spacing(3),
    },
  })

export default styles
