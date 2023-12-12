import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    caption: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      padding: 7,
    },
    greenbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.green.light : theme.palette.green.dark,
      },
    },
    textfield: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 4,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px 16px',
      },
      '& .MuiInputLabel-outlined': {
        top: 12,
      },
      margin: '0.5rem 0 1rem 0',
    },
    installmentsForm: {
      marginBottom: '1rem'
    }
  })

export default styles
