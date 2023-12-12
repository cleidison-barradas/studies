import { fade } from "@material-ui/core"

export default (theme: any) => ({
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: theme.spacing(1)
    },
    input: {
        '& .MuiInput-root': {
            borderRadius: 4,
        }
    },
    link: {
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        textDecoration: 'none'
    },
    caption: {
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        fontSize : 14,
    },
    textarea: {
        '& .MuiInputBase-input': {
            height: 164,
            padding: 0,
        },
        '& .MuiInput-root': {
            borderRadius: 4,
        }
    },
    title:{
        fontSize : 20
    },
    description:{
        fontSize : 14,
    },
    chip:{
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        backgroundColor: theme.palette.type === 'light' ? fade(theme.palette.grey.primary.light,0.15) : fade(theme.palette.grey.primary.dark,0.15)
    }
}) as any