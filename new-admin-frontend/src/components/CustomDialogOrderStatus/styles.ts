export default (theme: any) => ({
  orderstatuscontainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    width: '100%'
  },

  actions: {
    display: 'flex',
    marginTop: 10,
  },

  formcontrolswitch: {
    marginTop: 10
  },
  bodyText:{
    fontFamily: 'Raleway',
    fontSize: '14px',
    fontWeight: '450',
    lineHeight: '20px',
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#474F57'
  },

  buttonconfirm: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    marginRight: 10
  },

  buttoncancel: {
    backgroundColor: 'transparent',
    color: theme.palette.type === 'light' ? theme.palette.grey.light : theme.palette.grey.dark,
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey.light : theme.palette.grey.dark,
    },
  },
  label: {
    '.MuiFormControlLabel-root MuiFormControlLabel-labelPlacementStart': {
      marginLeft: 4
    }
  }
}) as any