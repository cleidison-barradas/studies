export default (theme: any) =>
  ({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },

    title: {
      fontSize: 24,
      borderBottom: `1px solid ${theme.palette.grey.primary.light}`,
      paddingBottom: 10,
    },

    loadingcontainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardContainer: {
      width: '80%',
      height: 200,
    },

    select: {
      width: '30%',
      background: 'transparent',
      outline: 'none',
      border: 'none',
      color: '#000000',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
  } as any)
