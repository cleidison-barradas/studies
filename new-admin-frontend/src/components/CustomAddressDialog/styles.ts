import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      backgroundColor: 'rgba(0, 0, 0, 0.60)',
      alignItems: 'flex-start',
    },
    content: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'start',
      justifyContent: 'space-between',
      gap: '24px'
    },
    image: {
      width: '96px',
      height: '96px',
    },
    texts: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    title: {
      fontSize: '24px',
      marginBottom: 2,
      marginTop: 2,
    },
    buttons: {
      paddingTop: '5%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      gap: '16px',
      width: '100%'
    },
    cancelButton: {
      padding: '8px 16px',
      width: '50%'
    },
    acceptButton: {
      padding: '8px 16px',
      width: '50%',
    },
    form: {
        width: '100%',
        height: '100%',
        marginTop: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            paddingRight: 0,
        },
      },
      formControl10: {
        width: '9%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },

    formControl20: {
        width: '19%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },

    formControl30: {
        width: '29%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },

    formControl33: {
        width: '32%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },

    formControl40: {
        width: '39%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },

    formControl50: {
        width: '49%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },

    formControl60: {
        width: '59%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },

    formControl70: {
        width: '69%',
        marginBottom: 20,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginRight: 0,
        },
    },
    inputMask: {
        width: '100%',
        fontSize: 16,
        height: 52,
        padding: '0 12px 0 12px',
        border: '1px solid #999',
        background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        '&:hover': {
          border: '1px solid #5CB9FF',
        },
      },
      label: {
        color: theme.palette.grey.primary.light,
    },
    fieldroot: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            padding: 8,
        },
        '& .MuiInputLabel-formControl': {
            top: 10,
        },
    },
    input: {
        color: 'black',
      },
  })

export default styles