import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    caption: {
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
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
    switchField: {
      marginLeft: 10
    },
    feeInput: {
      flexGrow: 1,
      width: '100%',
      height: '50px',
      borderRadius: 4,
      padding: '16px 16px',
      top: 12,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#92A0AC'
    },
    freeFeeTax: {
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
    fee: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    minValueInput: {
      width: '100%',
      height: '50px',
      borderRadius: 4,
      padding: '16px 16px',
      top: 12,
      backgroundColor: 'transparent',
      borderWidth: 1,
      marginBottom: 1,
      borderColor: '#92A0AC'
    },
    switch: {
      display: 'flex',
      padding: '0.2rem 1rem',
      borderRadius: '3.125rem',
    },
    applyFee: {
      display: 'flex',
      padding: '0.2rem 1rem',
      borderRadius: '3.125rem',
    }
  })

export default styles
