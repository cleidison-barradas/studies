import { SwitchProps } from './model'
import { SwitchStyled } from './styles'

export const Switch = (props: SwitchProps) => {
  const { onChange, checked } = props

  return (
    <SwitchStyled onClick={() => onChange(!checked)} {...props}>
      <div>
        <div />
      </div>

    </SwitchStyled>
  )
}
