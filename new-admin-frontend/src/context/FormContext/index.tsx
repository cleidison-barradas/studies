import React, { Component, createContext } from 'react'
import { onFormChange as formFields, onFieldChange as parseFields } from '../../helpers/form-fields.helper'

// Whole context data
interface FormContextData {
  form: any,
  resetFields: (...args: any) => void,
  onFormChange: any
}

// Create context
const { Provider, Consumer } = createContext({} as FormContextData)

export const FormConsumer = Consumer

export class FormProvider extends Component {
  state = {
    form: {}
  }

  /**
   * Reset fields of form
   *
   * @param form
   */
  resetFields = (form: string) => {
    this.setState((state: any) => ({
      ...state,
      form: {
        ...state.form,
        [form]: {}
      }
    }))
  }

  /**
   * Event for form change
   *
   * @param ev
   */
  onFormChange = (ev: any, formName: any = null) => {
    let input: any = null

    if (!formName) {
      const parsed = formFields(ev)
      formName = parsed.form
      input = parsed.input
    } else {
      const parsed = parseFields(formName, ev)
      input = parsed.input
    }

    this.setState((state: any) => ({
      ...state,
      form: {
        ...state.form,
        [formName]: {
          ...state.form[formName],
          [input.name]: input.value
        }
      }
    }))
  }

  render() {
    const { form } = this.state

    return (
      <Provider value={{
        form,

        resetFields: this.resetFields,
        onFormChange: this.onFormChange
      }}>
        {this.props.children}
      </Provider>
    )
  }
}