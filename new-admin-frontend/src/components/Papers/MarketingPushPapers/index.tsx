import { Box, Button, Chip, Grid, TextField, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import { ReactComponent as EmailIlustration } from '../../../assets/images/ilustration/email.svg'
import style from './style'
import LaunchIcon from '@material-ui/icons/Launch'
import { Link } from 'react-router-dom'

type Props = {
    classes: any
    mode: any
    selected: string
    setSelected: any
}

class MarketingPushPapers extends Component<Props> {
    render() {
        const { classes, mode, setSelected, selected } = this.props
        return (
            <>
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <PaperBlock title="Envie uma Notificação para todos os seus clientes">
                            <Typography className={classes.label}>Título da sua notificação</Typography>
                            <TextField
                                placeholder="Escreva o título da sua notificação"
                                classes={{
                                    root: classes.input,
                                }}
                                fullWidth
                            />
                            <Box mt={2} mb={2}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Button
                                            variant={selected === 'html' ? 'contained' : 'outlined'}
                                            color={selected === 'html' ? 'primary' : 'default'}
                                            onClick={() => setSelected('html')}
                                        >
                                            html
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={selected === 'text' ? 'contained' : 'outlined'}
                                            color={selected === 'text' ? 'primary' : 'default'}
                                            onClick={() => setSelected('text')}
                                        >
                                            Formato texto
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Typography className={classes.label}>Notificação em HTML</Typography>
                            <Typography>
                                É uma versão de layout que utiliza código e exibe as informações de forma melhor organizada.
                            </Typography>
                            <Box mt={1} mb={1}>
                                <Grid container justify="space-between" alignItems="center">
                                    <Grid item>
                                        <Typography className={classes.caption}>Corpo da sua Notificação</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Link to="/" className={classes.link}>
                                            {' '}
                                            Visualizar Prévia <LaunchIcon />{' '}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                            <TextField
                                multiline
                                rows={3}
                                fullWidth
                                placeholder={
                                    selected === 'text'
                                        ? 'Escreva o seu corpo da Notificação'
                                        : 'Escreva em código HTML o seu corpo da Notificação'
                                }
                                classes={{
                                    root: classes.textarea,
                                }}
                            />
                        </PaperBlock>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <div>
                            <PaperBlock>
                                <Grid container spacing={4} wrap={'nowrap'}>
                                    <Grid item>
                                        <EmailIlustration />
                                    </Grid>
                                    <Grid item>
                                        <Grid container direction="column" justify="space-between" style={{ height: '100%' }}>
                                            <Typography className={classes.title}>
                                                Como criar um disparao de notificação em massa?
                                            </Typography>
                                            <Typography className={classes.description}>
                                                Conheça as dicas que temos para melhorar as notificações que seus clientes
                                                recebem.
                                            </Typography>
                                            <a className={classes.link} href=" ">
                                                {' '}
                                                Veja o tutorial <LaunchIcon />{' '}
                                            </a>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </PaperBlock>
                        </div>
                        <div>
                            <PaperBlock title="Explicação do código">
                                <Typography className={classes.description}>
                                    O conteúdo deste email utiliza variáveis de código. É importante conhecê-las para entender as
                                    informações que você vai mostrar.
                                </Typography>
                                <Box mt={2}>
                                    <Grid container spacing={2} wrap="nowrap" alignItems="center">
                                        <Grid item>
                                            <Chip
                                                label="{{ contact_name }}"
                                                classes={{
                                                    root: classes.chip,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography className={classes.caption}>Nome do cliente</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mt={1}>
                                    <Grid container spacing={2} wrap="nowrap" alignItems="center">
                                        <Grid item>
                                            <Chip
                                                label="{{ url }}"
                                                classes={{
                                                    root: classes.chip,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography className={classes.caption}>Link para mudar a senha.</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mt={1}>
                                    <Grid container spacing={2} wrap="nowrap" alignItems="center">
                                        <Grid item>
                                            <Chip
                                                label="{{ store_name }}"
                                                classes={{
                                                    root: classes.chip,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography className={classes.caption}>Nome da sua loja.</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </PaperBlock>
                        </div>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default withStyles(style)(MarketingPushPapers)
