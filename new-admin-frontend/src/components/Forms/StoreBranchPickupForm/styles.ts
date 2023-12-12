import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    title: {
      fontSize: 20,
    },
    divcontainer: {
      width: '100%',
      display: 'flex',
      marginTop: 20,
    },
    inputs: {
      maxWidth: 560,
      margin: '0 10px 0 0',
      '& .MuiOutlinedInput-input': {
        padding: '8px 15px',
      },
      '& .MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error': {
        position: 'absolute',
        bottom: -20,
      },
    },
    actionbutton: {
      display: 'flex',
      justifyContent: 'center',
      fontSize: 14,
      margin: '0 0 0 10px',
      height: 40,
    },
    divtexthelp: {
      display: 'flex',
      alignItems: 'center',
    },
    iconhelp: {
      fontSize: 16,
      color: '#B8C5D0',
      marginLeft: 5,
    },
    textfield: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 4,
      },
      '& .MuiInputLabel-outlined': {
        top: 12,
      },
      '& .MuiOutlinedInput-input': {
        paddingTop: 16,
        paddingBottom: 16,
      },
      '& .MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error': {
        position: 'absolute',
        bottom: -20,
      },
    },
    titlebox: {
      paddingBottom: 10,
    },
    boldtitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  })

export default styles
