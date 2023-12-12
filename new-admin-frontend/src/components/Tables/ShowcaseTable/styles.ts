import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    tablecell: {
      borderBottom: 'none',
      padding: 0,
      width: '25%',
    },
    tablerow: {
      borderBottom: 'none',
      width: '100%',
      '& :hover': {
        cursor: 'grab',
      },
    },
    table: {
      margin: 0,
      minWidth: 500,
      tableLayout: 'auto',
    },
  })

export default styles
