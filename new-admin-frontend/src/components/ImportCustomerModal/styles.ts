import { createStyles, Theme } from "@material-ui/core"

const styles = (theme: Theme) => createStyles({
  link: {
    color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    textDecoration: 'none',
    display: 'flex',
    marginRight: theme.spacing(2),
    '& svg': {
      marginRight: theme.spacing(1),
    },
  }
})

export default styles