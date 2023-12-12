import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  tableroot: {
    minWidth: 450
  },
  tablecellroot: {
    fontSize: 14,
    paddingLeft: 0,
  },
  tableheadtxt: {
    fontSize: 14,
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  },
  fetchingcontainer: {
    with: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'center'
  }

})

export default styles