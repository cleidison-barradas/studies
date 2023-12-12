import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        redbtn: {
            backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
            color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
            '&:hover': {
                backgroundColor: theme.palette.type === 'dark' ? theme.palette.red.light : theme.palette.red.dark,
            },
        },
        root: {
            overflow: 'hidden',
        },
    })

export default styles
