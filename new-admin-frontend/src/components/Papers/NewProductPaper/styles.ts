import { createStyles } from '@material-ui/core'

const styles = (theme: any) =>
    createStyles({
        headergrid1: {
            [theme.breakpoints.down('md')]: {
                marginBottom: theme.spacing(2),
            },
        },
        goback: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 36,
            width: 36,
            background: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
            borderRadius: 4,
            marginRight: theme.spacing(2),
            boxShadow: '0px 1px 5px 0px rgba(80,80,80, 0.2), 0px 2px 2px 0px rgba(80,80,80, 0.14), 0px 3px 1px -2px rgba(80,80,80, 0.12)',
        },
        gobacktext: {
            fontSize: 24,
            color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.white.dark,
        },
        header: {
            marginBottom: theme.spacing(2),
            marginLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            marginTop: theme.spacing(4),
        },
    })

export default styles
