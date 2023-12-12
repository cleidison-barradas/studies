import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    cellroot: {
      padding: 0,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    registerbtn: {
      textDecoration: 'none',
      backgroundColor: theme.palette.green.light,
      boxSizing: 'border-box',
      padding: 10,
      color: 'white',
      borderRadius: 20,
    },
    paginationroot: {},
    paginationarrows: {},
  })

export default styles
