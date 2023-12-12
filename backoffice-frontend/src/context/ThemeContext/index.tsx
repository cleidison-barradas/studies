import React, { Component, createContext } from 'react'
import { saveStorage, loadStorage } from '../../services/storage'

// That's our local storage key
export const STORAGE_KEY = '@myp/admin-theme'

interface ThemeContextState {
    color: string
    mode: 'dark' | 'light' | undefined
    sidebarOpen: boolean
}

// Whole context data
interface ThemeContextData extends ThemeContextState {
    changeMode: (mode: 'dark' | 'light' | undefined) => void
}

// Create context
const { Provider, Consumer } = createContext({} as ThemeContextData)

export const ThemeConsumer = Consumer

export class ThemeProvider extends Component {
    // Initial state
    state: ThemeContextState = {
      color: 'skyBlueTheme',
      mode: 'light',
      sidebarOpen: true
    }

    constructor (props: any) {
      super(props)

      const store = loadStorage(STORAGE_KEY)

      // We do already have stored theme data?
      if (store) {
        this.state = {
          ...this.state,
          ...store
        }
      }
    }

    /**
     * Change theme mode
     *
     * @param mode
     */
    changeMode = (mode: 'dark' | 'light' | undefined) => {
      this.setState(
        {
          mode
        },
        () => {
          saveStorage(STORAGE_KEY, this.state)
        }
      )
    }

    render () {
      return (
            <Provider
                value={{
                  ...this.state,
                  changeMode: this.changeMode
                }}
            >
                {this.props.children}
            </Provider>
      )
    }
}
