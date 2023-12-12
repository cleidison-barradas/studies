export default (theme: any) =>
  ({
    emptyContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    link: {
      width: 235,
      height: 32,
      background: theme.palette.primary.light,
      borderRadius: 20,
      color: 'white',
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textColorWrapper: {
      width: '100%',
      height: '80%',
      color: `${theme.palette.type === 'dark' ? theme.palette.black.primary.dark : theme.palette.black.primary.light} !important`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    value: {
      fontSize: 12,
      margin: 0,
    },
    dashed: {
      borderBottom: `1px dashed ${theme.palette.grey.primary.light}`,
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    scroll: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      maxHeight: '60%',
      borderBottom: `1px solid ${
        theme.palette.type === 'light' ? theme.palette.secondary.lighter : theme.palette.grey.primary.dark
      } !important`,

      '&::-webkit-scrollbar': {
        width: 6,
      },

      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        background: theme.palette.grey.primary.light,
      },
    },
    loadingcontainer: {
      width: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  } as any)
