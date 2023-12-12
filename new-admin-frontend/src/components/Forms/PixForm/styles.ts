import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    title: {
      fontSize: 20,
    },
    caption: {
      fontSize: 16,
      color: theme.palette.grey.primary.dark,
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
    },
    redbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.red.light : theme.palette.red.dark,
      },
    },
    fileInput: {
      opacity: 0,
      zIndex: -1,
      width: 0.1,
      height: 0.1,
    },
    fileContainer: {
      borderRadius: 4,
      height: '100%',
      border: `1px solid ${theme.palette.grey.primary.light}`,
      color: theme.palette.grey.primary.light,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(1),
      position: 'relative',
      '& label': {
        position: 'absolute',
        top: -12,
        left: 10,
        fontSize: 12,
        padding: 4,
        zIndex: 1,
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.white.dark : theme.palette.white.light,
      },
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    },
  })

export default styles
