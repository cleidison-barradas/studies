import { Theme } from '@material-ui/core'

export default (theme: Theme) =>
  ({
    exportbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.white.light,
      '&:hover': {
        backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
      },
    },
    importtbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.white.light,
      '&:hover': {
        backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
      },

    },
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    },
  } as any)
