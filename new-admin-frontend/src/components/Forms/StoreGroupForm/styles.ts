import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    divcontainer: {
      width: '100%',
      margin: '0 0 20px 6px',
    },
    inputs: {
      maxWidth: 450,
      marginBottom: 10,
      '& .MuiOutlinedInput-input': {
        padding: '8px 15px',
      },
    },
    autocomplete: {
      maxWidth: 650,
      marginTop: 10,
    },
  })

export default styles
