import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
    createStyles({
        container: {},
        true: {
          fontWeight: 'bold',
          color: "#21ff99"
        },
        false: {
          fontWeight: 'bold',
          color: "#ff0000"
        }
    })

export default styles
