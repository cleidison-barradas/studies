import { useContext } from 'react'
import { Step, Stepper, StepLabel } from '@material-ui/core'

import { BenefitsDocks } from '../../components/BenefitsDocks'
import { ActiveDocks } from '../../components/ActiveDocks'
import { SynchronizeStock } from '../../components/SynchronizeStock'
import { SyncDocksContext } from '../../context/SyncDocks'
import { BackModalSyncDocks } from '../BackModalSyncDocks'
import { NextModalSyncDocks } from '../NextModalSyncDocks'

import { SyncDocksStyled } from './styles'
import { SyncDocksProps } from './model'

export const SyncDocks = (_props: SyncDocksProps) => {
  const { step, setStep, status, checkpoint, synchronize, setCheckpoint } = useContext(SyncDocksContext)

  const steps = [
    {
      title: 'Benefícios',
      children: (
        <BenefitsDocks
          onFinish={() =>
            setCheckpoint({
              ...checkpoint,
              next: true,
              onNext: () => setStep(1),
            })
          }
        />
      ),
    },
    {
      title: 'Ativação',
      children: <ActiveDocks />,
    },
    {
      title: 'Sincronização',
      children: <SynchronizeStock />,
    },
    {
      title: 'Pedidos',
      children: <></>,
    },
  ]

  return (
    <SyncDocksStyled>
      <div>
        {(synchronize.loading ? false : status === 'none') && (
          <Stepper className="sync-docks-stepper" activeStep={step + 1} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index} onClick={() => setStep(index)}>
                <StepLabel>{label.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {steps[step].children}

        <BackModalSyncDocks
          open={checkpoint.back}
          onBack={checkpoint.onBack}
          onNext={checkpoint.onNext}
          onToggle={() => setCheckpoint({ ...checkpoint, back: false })}
        />

        <NextModalSyncDocks
          open={checkpoint.next}
          onBack={checkpoint.onBack}
          label={checkpoint.label}
          onNext={checkpoint.onNext}
          onToggle={() => setCheckpoint({ ...checkpoint, next: false })}
        />
      </div>
    </SyncDocksStyled>
  )
}
