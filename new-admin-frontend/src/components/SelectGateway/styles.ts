import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  selectField: {
    borderRadius: 4,
    '& .MuiOutlinedInput-input': {
      padding: '16px 16px',
    },
    '& .MuiInputLabel-outlined': {
      top: 12,
    },
  },
  content: {
    paddingRight: 15
  }
})

export default styles
