import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        title: {
            fontSize: 20,
        },
        caption: {
            fontSize: 16,
            color: theme.palette.grey.primary.dark,
        },
        textfield: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 4,
            },
            '& .MuiOutlinedInput-input': {
                padding: '16px 16px',
            },
            '& .MuiInputLabel-outlined': {
                top: 12,
            },
        },
        redbtn: {
            backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
            color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
            '&:hover': {
                backgroundColor: theme.palette.type === 'dark' ? theme.palette.red.light : theme.palette.red.dark,
            },
        },
    })

export default styles
