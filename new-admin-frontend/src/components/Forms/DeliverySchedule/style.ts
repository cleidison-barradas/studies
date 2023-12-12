export default (theme: any) => ({
  row: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
          width: '100%',
      },
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      marginRight: theme.spacing(4),
      flexWrap: 'wrap',
      marginBottom: theme.spacing(1)
  },
  time: {
      width: 98,

      '& .MuiInput-root': {
          borderColor: 'transparent',
          '&:hover,active': {
              borderColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
          },
          borderRadius: 20,
          color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      },
  },
  afterBreak: {
      [theme.breakpoints.up('lg')]: {
          marginLeft: 15,
      },
  },
  empty: {
      '& .MuiInput-root': {
              borderColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
      },
  },
  header: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
          justifyContent: 'space-between',
          marginLeft: 'none'
      },
  },
  trash: {
      marginLeft: 20,
  },
  text: {
      marginRight: theme.spacing(2),
  },
  dashed: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
  },
  button: {
      background: 'transparent',
      fontSize: 12,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      '& img': {
          marginLeft: 15,
      },
      fontWeight: 'normal',
      textTransform: 'capitalize'
  },
  error: {
      color: '#E72222',
      alignSelf: 'left',
      fontSize: '13px'
  },
  averageTime: {
    marginBottom: 15,
    marginTop: 20,
  },
  fetchingcontainer:{
      width: '100%',
      height: '90%',
      display : 'flex',
      justifyContent : 'center',
      alignItems : 'center',
  }

}) as any