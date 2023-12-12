export default (theme: any) =>
  ({
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    },
    searchiconroot: {
      color: 'transparent',
    },
    inputSlider: {
      width: 45,
      borderRadius: 4,
      padding: 0,
    },
    exportbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.white.light,
      '&:hover': {
        backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
      },
    },
  } as any)
