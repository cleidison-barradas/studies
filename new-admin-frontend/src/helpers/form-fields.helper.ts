type FormChangeProps = {
  form: string
  input: {
    name: string
    value: string
  }
}

/**
 * Split input out of its form, returning form name and input meta properly
 *
 * @param ev
 * @returns {FormChangeProps}
 */
export const onFormChange = (ev: any): FormChangeProps => {
  const { nativeEvent, target } = ev

  const { path } = nativeEvent

  // Get last form of the input
  const form = path.find((p: any) => p.tagName === 'FORM')

  // Slice out the form name from input name
  const realInputName = target.name.replace(`${form.name}_`, '')

  if (target.type === 'checkbox') {
    return {
      form: form.name,
      input: {
        name: realInputName,
        value: target.checked,
      },
    }
  }

  return {
    form: form.name,
    input: {
      name: realInputName,
      value: target.value,
    },
  }
}

/**
 * Split field for its form
 */
export const onFieldChange = (formName: any, ev: any) => {
  const {
    target: { name, value },
  }: any = ev

  return {
    form: formName,
    input: {
      name,
      value,
    },
  }
}
