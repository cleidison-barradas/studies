import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        form: {
            width: '100%',
            marginTop: theme.spacing(3),
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingRight: '20%',
            [theme.breakpoints.down('sm')]: {
                paddingRight: 0,
            },
        },

        input: {
            color: 'black',
        },

        formButtons: {
            width: '100%',
            marginTop: theme.spacing(3),
            display: 'flex',
            flexWrap: 'wrap',
            paddingRight: '20%',
            [theme.breakpoints.down('sm')]: {
                paddingRight: 0,
            },
        },

        formControlButton: {
            width: '30%',
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },

        label: {
            color: theme.palette.grey.primary.light,
        },

        formControl10: {
            width: '9%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        formControl20: {
            width: '19%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        formControl30: {
            width: '29%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        formControl33: {
            width: '32%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        formControl40: {
            width: '39%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        formControl50: {
            width: '49%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        formControl60: {
            width: '59%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        formControl70: {
            width: '69%',
            marginBottom: 20,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginRight: 0,
            },
        },

        fieldroot: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                padding: 8,
            },
            '& .MuiInputLabel-formControl': {
                top: 10,
            },
        },
        inputMask: {
          width: '100%',
          fontSize: 18,
          height: 52,
          padding: '0 12px 0 12px',
          border: '1px solid #999',
          background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
          '&:hover': {
            border: '1px solid #5CB9FF',
          },
        },
    })

export default styles
