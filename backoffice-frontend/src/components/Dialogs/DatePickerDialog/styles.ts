import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    container: {
      '& .MuiPaper-root': {
        boxShadow: 'none !important'
      }
    }
  })

export default styles
