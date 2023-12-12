export default (theme: any) =>
  ({
    headerrow: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
    headertitle: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.light,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center',
      },
    },
    buttongroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        minWidth: '0',
      },
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
    obutton: {
      margin: 2,
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      fontSize: 14,
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      borderRadius: 20,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 400,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    link: {
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.light,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: theme.spacing(1),
      },
    },
    footer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    btngroup: {
      '& button + button': {
        marginLeft: theme.spacing(2),
      },
    },
    exportbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.white.light,
      '&:hover': {
        backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
      },
    },
  } as any)
