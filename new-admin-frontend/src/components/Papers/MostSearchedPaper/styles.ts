export default (theme: any) =>
  ({
    container: {
      padding: 20,
      paddingTop: 15,
      background: theme.palette.type === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.light,
      display: 'relative',
    },

    title: {
      fontSize: 24,
      borderBottom: `1px solid ${theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light}`,
      paddingBottom: 10,
      boxSizing: 'border-box',
      color: 'white',
    },

    row: {
      display: 'flex',
      flexWrap: 'wrap',
      overflowY: 'auto',
      height: '70%',

      '&::-webkit-scrollbar': {
        width: 6,
      },

      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        background: '#fff',
      },
    },

    searchContainer: {
      position: 'relative',
      margin: 10,
      background: 'transparent',
    },

    searchTerm: {
      background: theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
      borderRadius: 20,
      textAlign: 'center',
      padding: 5,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '',
      color: 'white',
    },

    timesSearched: {
      position: 'absolute',
      background: '#fff',
      left: 10,
      borderRadius: 20,
      color: '#42A5F5',
      boxSizing: 'border-box',
      wordBreak: 'keep-all',
      padding: 1,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      letterSpacing: 1.5,
      fontSize: 10,
      fontWeight: 'bold',
      top: -7,
    },

    select: {
      width: '15%',
      background: 'transparent',
      outline: 'none',
      border: 'none',
      marginTop: 10,
      color: '#fff',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },

    emptyContainer: {
      height: '70%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    link: {
      width: 235,
      height: 32,
      background: theme.palette.yellow.primary.light,
      borderRadius: 20,
      color: theme.palette.primary.light,
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingcontainer: {
      width: '100%',
      height: '70%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  } as any)
