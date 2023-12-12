import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    buttonsave: {
      '&.MuiButton-contained.Mui-disabled': {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        background: '#B8C5D0',
      },
      margin: '0 10px 0 0',
    },
    buttondelete: {
      background: '#FF5353',
      color: '#fff',
      '&.MuiButton-contained.Mui-disabled': {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        background: '#B8C5D0',
      },
    },
  })

export default styles
