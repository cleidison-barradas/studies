export default (theme: any) =>
  ({
    table: {
      minWidth: '100%',
    },
    tablecellroot: {
      paddingLeft: '0px',
    },
    checkbox: {
      padding: '0px',
    },
    checkboxbtn: {
      textTransform: 'none',
      paddingLeft: '8px',
    },
    deletebtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        backgroundColor: theme.palette.red.dark,
        color: theme.palette.white.dark,
      },
    },
    link: {
      textDecoration: 'none',
      cursor: 'pointer',
      color: 'inherit',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    statusText: {
      fontWeight: 'bold',
      color: 'white',
    },
    statuscontainer: {
      borderRadius: 20,
      width: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      height: 36,
    },
    on: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    off: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    },
  } as any)
