export default (theme: any) =>
  ({
    flex: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: '150px',
    },
    flexbuttons: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '60%',
    },
    buttonconfirm: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
      },
    },

    buttoncancel: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.grey.light : theme.palette.grey.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey.light : theme.palette.grey.dark,
      },
    },
  } as any)
