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
  })

export default styles

