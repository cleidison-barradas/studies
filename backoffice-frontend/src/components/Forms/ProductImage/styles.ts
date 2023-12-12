import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        uploadertext: {
            textAlign: 'center',
            fontSize: 16,
            color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
            marginTop: theme.spacing(2),
        },
        title: {
            marginBottom: theme.spacing(2),
            fontSize: 20,
        },
        imagesrow: {
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            marginTop: theme.spacing(2),
        },
        image: {
            height: 240,
            width: 240,
            minWidth: 240,
            borderRadius: 20,
            marginRight: theme.spacing(2),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: theme.transitions.create('brightness', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            '&:hover': {
                cursor: 'pointer',
                filter: 'brightness(0.7)',
                '& $deleteicon': {
                    opacity: 1,
                },
            },
        },
        deleteicon: {
            opacity: 0,
        },
    })

export default styles
