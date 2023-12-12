import Icon from 'react-inlinesvg'

import { CheckboxProps } from './model'
import { CheckboxStyled } from './styles'

import confirmIcon from '../../assets/icons/ConfirmIcon.svg'

export const Checkbox = (props: CheckboxProps) => {
  return (
    <CheckboxStyled {...props}>
      <Icon width={12} src={confirmIcon} />
    </CheckboxStyled>
  )
}

export default Checkbox
