import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    addnewbtn: {
      textTransform: 'none'
    },
    row: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  })

export default styles
