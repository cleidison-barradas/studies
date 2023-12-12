import React, { Component } from 'react'

type FormizedProps = {
  name: string,
  onChange: any,
  onFinish?: any
}

export default class Formized extends Component<FormizedProps> {

  static defaultProps = {
    onFinish: () => null
  }

  handleSubmit = (ev: any) => {
    ev.preventDefault()
    const { onFinish } = this.props
    const { target } = ev

    const values = {} as any
    for (const input of target) {
      if (input.tagName === 'INPUT' || input.tagName === 'SELECT' || input.tagName === 'TEXTAREA') {
        values[input.name] = input.value
      }
      if (input.type === 'checkbox') {
        values[input.name] = input.checked
      }
    }

    if (onFinish) {
      onFinish(values)
    }
  }

  render() {
    const { children, name, onChange } = this.props

    return (
      <form name={name} onChange={onChange} onSubmit={this.handleSubmit}>
        {children}
      </form>
    )
  }
}
