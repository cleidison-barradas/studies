export default (theme: any) =>
  ({
    statuscontainer: {
      borderRadius: 20,
      width: 164,
      height: 36,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
    },
    loadingcontainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    published: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    unpublished: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    statustext: {
      color: 'white',
      fontSize: 14,
    },
    headertext: {
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      fontSize: 24,
      marginBottom: theme.spacing(3),
    },
  } as any)
