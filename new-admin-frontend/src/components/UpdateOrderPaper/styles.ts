import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    },
    gobackbtn: {
      borderRadius: 4,
      backgroundColor: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    },
    printf: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.green.light : theme.palette.green.dark,
      },
    },
    paperWidthSm: {
      width: 600,
    },
    noPrint: {
      '@media print': {
        display: 'none !important',
      },
    },
    boldPrint: {
      '@media print': {
        fontWeight: 'bold !important',
      },
    },
  })

export default styles
