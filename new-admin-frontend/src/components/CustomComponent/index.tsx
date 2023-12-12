import { Component } from 'react'
import Plan from '../../interfaces/plan'

export default class CustomComponent<T, S = {}> extends Component<{} & T, S> {
  canSeeComponent = (rules: string[] = [], plan?: Plan) => {
    if (plan) {
      return rules.includes(plan.rule)
    }
  }
}