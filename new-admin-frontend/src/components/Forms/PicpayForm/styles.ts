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
    })

export default styles
