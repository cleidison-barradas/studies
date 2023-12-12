import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    box: {
      border: '1px solid #B8C5D0',
      borderRadius: '10px',
    },
    title: {
      padding: 15,
      fontSize: 24
    },
    columnTitle: {
      fontWeight: 'bold'
    },
    content: {
      padding: 15,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 4,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px 16px',
      },
      '& .MuiInputLabel-outlined': {
        top: 12,
      },
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
    img: {
      width: '48px',
      height: '48px',
    }
  })

export default styles
