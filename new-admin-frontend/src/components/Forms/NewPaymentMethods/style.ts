import { createStyles } from '@material-ui/core'

const styles = (theme: any) => createStyles({
  divider: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,

  },

  line: {
    flexGrow: 1,
    marginLeft: theme.spacing(5),
    borderColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
  },
  section: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'none',
    },
    marginBottom: theme.spacing(4),
  },
  autocomplete: {
    width: '49%',
    height: 55,
    borderRadius: 4,
    fontSize: 14,
    marginBottom: theme.spacing(2),
    background: 'transparent',
    borderColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    '& .MuiFormControl-root label + div > div': {
      padding: '0px 8px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    '& .MuiInputBase-root': {
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },
    '& .MuiFormLabel-root': {
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },
    '& .MuiInputLabel-shrink': {
      color: `${theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark} !important `,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(4)
    },
  },
  fullwidth: {
    width: '100%'
  },
  input: {
    width: '49%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(4)
    },
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      height: 55,
      fontSize: 14,
      background: 'transparent',
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },
    '& .MuiFormLabel-root': {
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },
    '& .MuiInputLabel-shrink': {
      color: `${theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark} !important `,
    },
  },
  button: {
    marginTop: theme.spacing(2),
    textTransform: 'none',
    color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
  },
  buttonrow: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  inputGroup: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'none',
    },
  },
  saveButton: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    marginBottom: theme.spacing(3),
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    fontSize: 14,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
  },
  printf: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.green.light : theme.palette.green.dark,
    }
  },
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

  buttonconfirm: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    marginRight: 10
  },

  buttoncancel: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.red.light : theme.palette.red.dark,
    }
  },
  paperWidthSm: {
    width: 600,
  }

})
export default styles
