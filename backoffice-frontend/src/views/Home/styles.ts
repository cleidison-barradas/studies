import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
      row: {
        display: 'grid',
        width: '100%',
        height: '100%',
        flexWrap: 'wrap',
        gridTemplateColumns: '2fr 3fr',
        gridTemplateRows: '400px 255px 240px 400px',
        rowGap: '20px',
        columnGap: '20px',
        [theme.breakpoints.down('sm')]: {
          display: 'flex',
          flexWrap: 'wrap'
        }
      },

      users: {
        gridColumn: '1/2',
        gridRow: '1/2'
      },

      numbers: {
        gridColumn: '2/3',
        gridRow: '1/2'
      },

      fullGridRow: {
        gridColumn: '1/3',
        gridRow: '3/4',
        width: '100%'
      }
    }) as any

export default styles
