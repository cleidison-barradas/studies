import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        flexEnd: {
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: theme.spacing(3),
        },
    })

export default styles
