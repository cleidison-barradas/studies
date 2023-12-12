import { createStyles } from '@material-ui/core'

const styles = (theme: any) =>
    createStyles({
        description: {
            color: `${theme.palette.grey.primary.light} !important`,
        },
        textfield: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 8,
            },
            '& .MuiInputLabel-formControl': {
                top: 10,
            },
        },
        wrapperProducts: {
          display: 'grid'
        }
    })

export default styles
