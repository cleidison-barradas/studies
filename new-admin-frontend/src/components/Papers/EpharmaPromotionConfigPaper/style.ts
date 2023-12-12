import { Theme } from "@material-ui/core"
import { createStyles } from "@material-ui/core"

const style = (theme: Theme) => createStyles({
  headertxt: {
    fontSize: 24,
    color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark
  },
})

export default style