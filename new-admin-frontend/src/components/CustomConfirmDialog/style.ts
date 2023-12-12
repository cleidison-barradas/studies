import { fade } from "@material-ui/core"

export default (theme: any) => ({
  acceptbtn: {
    color: theme.palette.green.light,
    backgroundColor: fade(theme.palette.green.dark, 0.2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: fade(theme.palette.green.dark, 0.1),
    }
  },
  cancelbtn: {
    color: theme.palette.red.dark,
  },
  dialogcontexttext: {
    color: theme.palette.grey.primary.light
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}) as any