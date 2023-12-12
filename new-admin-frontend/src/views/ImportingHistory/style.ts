export default (theme: any) =>
  ({
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.dark,
    },
    warning: {
      color: theme.palette.red.dark,
    },
    tbutton: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.white.light,
      '&:hover': {
        backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
      },
      fontSize: 14,
      fontWeight: 400,
    },
  } as any)
