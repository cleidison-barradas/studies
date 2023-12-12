import React, { Component } from 'react'
import {
  Box,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'

import VisaFlag from '../../../assets/images/visaFlag.svg'
import MasterFlag from '../../../assets/images/masterFlag.svg'
import AmexFlag from '../../../assets/images/amexFlag.svg'
import EloFlag from '../../../assets/images/eloFlag.svg'
import HipercardFlag from '../../../assets/images/hipercardFlag.svg'
import CabalFlag from '../../../assets/images/cabalFlag.svg'

import styles from './styles'

interface StoneInstallmentFee {
  twoToSixFee: number,
  sevenToTwelveFee: number
}

interface StoneCardsFlagFee {
  visaFee: StoneInstallmentFee
  masterCardFee: StoneInstallmentFee
  americanExpressFee: StoneInstallmentFee
  hipercardFee: StoneInstallmentFee
  eloFee: StoneInstallmentFee
  cabalFee: StoneInstallmentFee
}

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  stoneCardFlagFee: StoneCardsFlagFee
  maxInstallments: number
}

export class InstallmentsFeePerFlagTable extends Component<Props> {
  render() {
    const { classes, maxInstallments, stoneCardFlagFee } = this.props
    return (
      <Grid item md={3} style={{ marginTop: 10, marginLeft: 15 }}>
        <Box className={classes.boxContentTitle}>
          <Typography className={classes.columnTitle}>Bandeira</Typography>
          <Typography className={classes.columnTitle}>2x até 6x</Typography>
          {maxInstallments >= 7 && (
            <Typography className={classes.columnTitle}>7x até 12x</Typography>
          )}
        </Box>
        <Box className={classes.boxContent}>
          <Typography>
            <img
              style={{
                width: '48px',
                height: '48px',
              }}
              src={VisaFlag}
              alt='visa flag'
            />
          </Typography>
          <Typography style={stoneCardFlagFee.visaFee.twoToSixFee <= 0 || stoneCardFlagFee.visaFee.twoToSixFee >= 25 ? { color: '#ff0000' } : {}}>
            {stoneCardFlagFee.visaFee.twoToSixFee}%
          </Typography>
          {maxInstallments >= 7 && (
            <Typography style={stoneCardFlagFee.visaFee.sevenToTwelveFee <= 0 || stoneCardFlagFee.visaFee.sevenToTwelveFee >= 25 ? { color: '#ff0000' } : {}}>
              {stoneCardFlagFee.visaFee.sevenToTwelveFee}%
            </Typography>
          )}
        </Box>
        <Box className={classes.boxContent} >
          <Typography>
            <img
              style={{
                width: '48px',
                height: '48px',
              }}
              src={MasterFlag}
              alt='master flag'
            />
          </Typography>
          <Typography style={stoneCardFlagFee.masterCardFee.twoToSixFee <= 0 || stoneCardFlagFee.masterCardFee.twoToSixFee >= 25 ? { color: '#ff0000' } : {}}>
            {stoneCardFlagFee.masterCardFee.twoToSixFee}%
          </Typography>
          {maxInstallments >= 7 && (
            <Typography style={stoneCardFlagFee.masterCardFee.sevenToTwelveFee <= 0 || stoneCardFlagFee.masterCardFee.sevenToTwelveFee >= 25 ? { color: '#ff0000' } : {}}>
              {stoneCardFlagFee.masterCardFee.sevenToTwelveFee}%
            </Typography>
          )}
        </Box >
        <Box className={classes.boxContent} >
          <Typography>
            <img
              style={{
                width: '48px',
                height: '48px',
              }}
              src={AmexFlag}
              alt='amex flag'
            />
          </Typography>
          <Typography style={stoneCardFlagFee.americanExpressFee.twoToSixFee <= 0 || stoneCardFlagFee.americanExpressFee.twoToSixFee >= 25 ? { color: '#ff0000' } : {}}>
            {stoneCardFlagFee.americanExpressFee.twoToSixFee}%
          </Typography>
          {maxInstallments >= 7 && (
            <Typography style={stoneCardFlagFee.americanExpressFee.sevenToTwelveFee <= 0 || stoneCardFlagFee.americanExpressFee.sevenToTwelveFee >= 25 ? { color: '#ff0000' } : {}}>
              {stoneCardFlagFee.americanExpressFee.sevenToTwelveFee}%
            </Typography>
          )}
        </Box >
        <Box className={classes.boxContent} >
          <Typography>
            <img
              style={{
                width: '48px',
                height: '48px',
              }}
              src={HipercardFlag}
              alt='hipercard flag'
            />
          </Typography>
          <Typography style={stoneCardFlagFee.hipercardFee.twoToSixFee <= 0 || stoneCardFlagFee.hipercardFee.twoToSixFee >= 25 ? { color: '#ff0000' } : {}}>
            {stoneCardFlagFee.hipercardFee.twoToSixFee}%
          </Typography>
          {maxInstallments >= 7 && (
            <Typography style={stoneCardFlagFee.hipercardFee.sevenToTwelveFee <= 0 || stoneCardFlagFee.hipercardFee.sevenToTwelveFee >= 25 ? { color: '#ff0000' } : {}}>
              {stoneCardFlagFee.hipercardFee.sevenToTwelveFee}%
            </Typography>
          )}
        </Box >
        <Box className={classes.boxContent} >
          <Typography>
            <img
              style={{
                width: '48px',
                height: '48px',
              }}
              src={EloFlag}
              alt='elo flag'
            />
          </Typography>
          <Typography style={stoneCardFlagFee.eloFee.twoToSixFee <= 0 || stoneCardFlagFee.eloFee.twoToSixFee >= 25 ? { color: '#ff0000' } : {}}>
            {stoneCardFlagFee.eloFee.twoToSixFee}%
          </Typography>
          {maxInstallments >= 7 && (
            <Typography style={stoneCardFlagFee.eloFee.sevenToTwelveFee <= 0 || stoneCardFlagFee.eloFee.sevenToTwelveFee >= 25 ? { color: '#ff0000' } : {}}>
              {stoneCardFlagFee.eloFee.sevenToTwelveFee}%
            </Typography>
          )}
        </Box >
        <Box className={classes.boxContent}>
          <Typography>
            <img
              style={{
                width: '48px',
                height: '48px',
              }}
              src={CabalFlag}
              alt='cabal flag'
            />
          </Typography>
          <Typography style={stoneCardFlagFee.cabalFee.twoToSixFee <= 0 || stoneCardFlagFee.cabalFee.twoToSixFee >= 25 ? { color: '#ff0000' } : {}}>
            {stoneCardFlagFee.cabalFee.twoToSixFee}%
          </Typography>
          {maxInstallments >= 7 && (
            <Typography style={stoneCardFlagFee.cabalFee.sevenToTwelveFee <= 0 || stoneCardFlagFee.cabalFee.sevenToTwelveFee >= 25 ? { color: '#ff0000' } : {}}>
              {stoneCardFlagFee.cabalFee.sevenToTwelveFee}%
            </Typography>
          )}
        </Box>
      </Grid >
    )
  }
}

export default withStyles(styles)(InstallmentsFeePerFlagTable)
