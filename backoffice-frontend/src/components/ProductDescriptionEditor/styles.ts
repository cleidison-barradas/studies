import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        container: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },

        editorHeightFix: {
            '& .rdw-editor-wrapper': {
                height: '100%',
            },
        },
        toolbarEditor: {
            background: theme.palette.white.dark,
            border: `1px solid ${theme.palette.grey.primary.dark}`,
        },

        textEditor: {
            paddingLeft: theme.spacing(2),
            border: `1px solid ${theme.palette.grey.primary.dark}`,
            background: theme.palette.white.dark,
            height: 450,
            [theme.breakpoints.down('sm')]: {
                height: 300,
            },
            color: 'black',
        },
        htmlEditor: {
            height: '100%',
            width: '100%',
            fontSize: 18,
            padding: theme.spacing(2),
            [theme.breakpoints.down('sm')]: {
                height: 300,
            },
            resize: 'none',
        },
        textareawrapper: {
            height: 450,
        },
    })

export default styles
