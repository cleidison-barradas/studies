import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
      dangertext: {
        fontSaize: 14,
        color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark
      },
      paperroot: {
        borderRadius: 8
      },
      select: {
        '& .MuiInput-root': {
          border: '0px',
          '& .MuiSelect-icon': {
            top: 'calc(50% - 13px)'
          }
        }
      }
    }) as any

export default styles
