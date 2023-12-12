export default (theme: any) =>
  ({
    title: {
      fontSize: 20,
    },
    deletebtn: {
      color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
      textTransform: 'none',
    },
    removebtn: {
      color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
      textTransform: 'none',
      fontSize: 12,
    },
    paper: {
      borderRadius: 20,
      padding: theme.spacing(3),
      marginBottom: theme.spacing(4),
      border: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
    },
    papertitle: {
      fontSize: 20,
    },
    text: {
      fontSize: 14,
      lineHeight: '20px',
      marginBottom: theme.spacing(2),
    },
    wrapper: {
      position: 'relative',
      width: '100%',
    },
    badge: {
      position: 'absolute',
      right: 15,
      top: -20,
      height: 44,
      width: 72,
      backgroundColor: theme.palette.orange,
      borderRadius: 8,
      color: theme.palette.white.light,
      fontSize: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    productpaper: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      width: '100%',
      height: 180,
      boxSizing: 'border-box',
      paddingBottom: theme.spacing(2),
      borderRadius: 20,
      cursor: 'move',
      [theme.breakpoints.down('xs')]: {
        height: 200,
      },
    },
    stockbtn: {
      color: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      textTransform: 'none',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
    },
    nounity: {
      color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    },
    name: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: theme.spacing(1),
    },
    slug: {
      fontSize: 12,
    },
    manufacturer: {
      fontSize: 12,
    },
    ean: {
      fontSize: 12,
      marginBottom: theme.spacing(1),
    },
    img: {
      maxHeight: 110,
      marginTop: theme.spacing(1),
    },
  } as any)
