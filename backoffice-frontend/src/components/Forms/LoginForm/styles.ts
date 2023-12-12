import { Theme, createStyles } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    formWrap: {
      padding: theme.spacing(5),
      paddingTop: 0,
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    input: {
      color: theme.palette.common.white,
      '& .MuiInput-root': {
        borderColor: theme.palette.common.white,
        borderRadius: 4,
        '& .MuiInputAdornment-root img,.MuiInputAdornment-root svg': {
          paddingLeft: '0px'
        }
      },
      '& .MuiInput-input': {
        paddingTop: 20,
        color: theme.palette.common.white
      },
      '& .MuiInputLabel-formControl': {
        top: 10
      },
      '& .MuiFormHelperText-root': {
        color: theme.palette.common.white
      }
    },
    label: {
      color: theme.palette.common.white
    }
  })

export default styles
