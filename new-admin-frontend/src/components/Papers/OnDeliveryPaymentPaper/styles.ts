import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        caption: {
            fontSize: 16,
            color: theme.palette.grey.primary.dark,
        },
        greenbtn: {
            backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
            color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
            '&:hover': {
                backgroundColor: theme.palette.type === 'dark' ? theme.palette.green.light : theme.palette.green.dark,
            },
        },
    })

export default styles
