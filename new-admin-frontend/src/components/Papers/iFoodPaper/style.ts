import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    bold: {
      fontWeight: 'bold',
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    value: {
      fontSize: 14,
    },
    cpfInput: {
      border: 0,
      '& .MuiInput-input': {
        fontSize: 18,
      },
    },
  })

export default styles
