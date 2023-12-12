import { createStyles } from '@material-ui/core'

const styles = (theme: any) =>
  createStyles({
    addoptionscontainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: theme.spacing(1),
    },
    formcontrol1: {
      marginBottom: 10
    },
    formcontrolselect: {
      marginBottom: 10
    },
    textfield: {
      '& .MuiInput-root,.MuiOutlinedInput-root': {
        borderRadius: 4,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px 16px',
      },
      '& .MuiInputLabel-formControl': {
        top: 12,
      },
    },
    select: {
      borderRadius: 4,
      '& .MuiInput-root': {
        borderRadius: 4,
        '& .MuiInput-input': {
          color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        },
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px 16px',
      },
      '& .MuiInputLabel-formControl': {
        top: 12,
      },
    },
    actions: {
      display: 'flex',
      marginTop: 10,
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
    }
  })

export default styles
