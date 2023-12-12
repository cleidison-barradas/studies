import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'

  },
  saveButton: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    marginBottom: theme.spacing(3),
    color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    fontSize: 14,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
    marginRight: 10
  },
  discardbtn: {
    marginBottom: theme.spacing(3),
    color: theme.palette.type === 'dark' ? theme.palette.grey.primary.dark : theme.palette.grey.primary.light,
    fontSize: 14,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
    marginRight: 10
  },
})

export default styles
