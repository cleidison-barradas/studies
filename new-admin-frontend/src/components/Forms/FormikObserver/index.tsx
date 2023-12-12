import { useFormikContext } from 'formik'
import { useEffect } from 'react'

type Props = {
  onChangeFunction?: (values: any) => void
  triggerSetValues?: boolean
  newValues?: any
  setTriggerSetValues?: () => void
}

const FormObserver: React.FC<Props> = (props) => {
  const { values, setFieldValue } = useFormikContext()
  const { onChangeFunction, setTriggerSetValues, triggerSetValues, newValues } = props

  useEffect(() => {
    if (triggerSetValues && setTriggerSetValues) {
      for (const key of Object.keys(newValues)) setFieldValue(key, newValues[key])
      setTriggerSetValues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSetValues])

  useEffect(() => {
    if (onChangeFunction) {
      onChangeFunction(values)
    }
  }, [values, onChangeFunction])

  return null
}

export default FormObserver
