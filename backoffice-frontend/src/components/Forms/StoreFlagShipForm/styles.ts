import { Theme, createStyles } from "@material-ui/core"

const styles = (theme: Theme) => createStyles({
  autocomplete: {
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
      padding: 0,
    },
  },
})

export default styles