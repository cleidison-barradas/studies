import { Box, Grid, Typography, withStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import style from './style'

type Props = {
    classes: any
    mode: any
}

class IntegrationSkeletons extends Component<Props> {
    render() {
        const { classes, mode } = this.props
        return (
            <>
                <Grid container spacing={3}>
                    <Grid item lg={9} md={8} xs={12}>
                        <div>
                            <PaperBlock>
                                <Box>
                                    <Box mb={1}>
                                        <Skeleton
                                            variant="rect"
                                            width={109}
                                            height={32}
                                            classes={{
                                                root: classes.skeleton,
                                            }}
                                        />
                                    </Box>
                                    <Grid container alignItems="center">
                                        <Grid item lg={4} md={6} sm={12}>
                                            <Grid container direction="column" justify="flex-start" spacing={1}>
                                                <Grid item>
                                                    <Skeleton
                                                        variant="rect"
                                                        width={109}
                                                        height={32}
                                                        classes={{
                                                            root: classes.skeleton,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Skeleton
                                                        variant="rect"
                                                        width={151}
                                                        height={32}
                                                        classes={{
                                                            root: classes.skeleton,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={4} md={6} sm={12}>
                                            <Grid container justify="flex-start" direction="column" spacing={1}>
                                                <Grid item>
                                                    <Skeleton
                                                        variant="rect"
                                                        width={151}
                                                        height={32}
                                                        classes={{
                                                            root: classes.skeleton,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Skeleton
                                                        variant="rect"
                                                        width={151}
                                                        height={32}
                                                        classes={{
                                                            root: classes.skeleton,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </PaperBlock>
                        </div>
                        <div>
                            <PaperBlock>
                                <Box>
                                    <Box mb={1}>
                                        <Skeleton
                                            variant="rect"
                                            width={266}
                                            height={32}
                                            classes={{
                                                root: classes.skeleton,
                                            }}
                                        />
                                    </Box>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item lg={2} md={2} sm={4} xs={4}>
                                            <Skeleton
                                                variant="rect"
                                                height={45}
                                                classes={{
                                                    root: classes.skeleton,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={2} md={2} sm={4} xs={4}>
                                            <Skeleton
                                                variant="rect"
                                                height={45}
                                                classes={{
                                                    root: classes.skeleton,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={5} md={5} sm={4} xs={4}>
                                            <Skeleton
                                                variant="rect"
                                                height={45}
                                                classes={{
                                                    root: classes.skeleton,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={3} sm={4} xs={4}>
                                            <Skeleton
                                                variant="rect"
                                                height={45}
                                                classes={{
                                                    root: classes.skeleton,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Skeleton
                                                variant="rect"
                                                height={45}
                                                classes={{
                                                    root: classes.skeleton,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Skeleton
                                                variant="rect"
                                                height={45}
                                                classes={{
                                                    root: classes.skeleton,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </PaperBlock>
                        </div>
                    </Grid>
                    <Grid item lg={3} md={4} xs={12}>
                        <div>
                            <PaperBlock>
                                <Box mb={2}>
                                    <Skeleton
                                        variant="rect"
                                        width={210}
                                        height={32}
                                        classes={{
                                            root: classes.skeleton,
                                        }}
                                    />
                                </Box>
                                <Box mb={2}>
                                    <Skeleton
                                        variant="rect"
                                        width={210}
                                        height={32}
                                        classes={{
                                            root: classes.skeleton,
                                        }}
                                    />
                                </Box>
                                <Box mb={1}>
                                    <Skeleton
                                        variant="rect"
                                        width={169}
                                        height={32}
                                        classes={{
                                            root: classes.skeleton,
                                        }}
                                    />
                                </Box>
                                <Box mb={1}>
                                    <Skeleton
                                        variant="rect"
                                        width={233}
                                        height={32}
                                        classes={{
                                            root: classes.skeleton,
                                        }}
                                    />
                                </Box>
                                <Box mb={2}>
                                    <Skeleton
                                        variant="rect"
                                        width={202}
                                        height={32}
                                        classes={{
                                            root: classes.skeleton,
                                        }}
                                    />
                                </Box>
                                <Skeleton
                                    variant="rect"
                                    width={170}
                                    height={40}
                                    classes={{
                                        root: classes.skeleton,
                                    }}
                                />
                            </PaperBlock>
                        </div>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Grid container>
                        <Grid item>
                            <img src={require('../../../assets/images/ilustration/erpupload.svg').default} alt="" />
                        </Grid>
                        <Grid item>
                            <Grid container direction="column">
                                <Typography className={classes.loadtitle}>
                                    No momento, estamos fazendo a integração com seu ERP.
                                </Typography>
                                <Box mt={1}>
                                    <Typography className={classes.loaddescription}>
                                        Isso pode levar algum tempo para ser concluído. Se quiser, sair <br /> desta área e
                                        continar trabalhando fique a vontade, será notificado <br /> quando tudo estiver pronto!
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </>
        )
    }
}

export default withStyles(style)(IntegrationSkeletons)
