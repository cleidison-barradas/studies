import { Theme } from "@material-ui/core"
import { createStyles } from "@material-ui/core"

const style = (theme: Theme) => createStyles({
  input: {
    '& .MuiInput-root': {
      borderRadius: 4,
      borderColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 4,
    }
  },
})

export default style