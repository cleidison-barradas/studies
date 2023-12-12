import { createStyles } from '@material-ui/core'

const styles = (theme: any) => createStyles({
  saveButton: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    marginBottom: theme.spacing(3),
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    fontSize: 14,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
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
  inputMask: {
    width: '100%',
    fontSize: 18,
    height: 52,
    padding: '0 12px 0 12px',
    border: '1px solid #999',
    borderRadius: 4,
    background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    '&:hover': {
      border: '1px solid #5CB9FF',
    },
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
  boxContentText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '508px'
  }
})

export default styles