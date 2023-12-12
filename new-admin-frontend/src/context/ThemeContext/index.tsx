import React, { Component, createContext } from 'react'
import { IStorageTheme, ThemeMode } from '../../interfaces/storageTheme'
import { saveStorage, loadStorage } from '../../services/storage'
import STORAGE_KEYS from '../../services/storageKeys'

interface ThemeContextState {
  color: string,
  mode: ThemeMode,
  sidebarOpen: boolean,
}

// Whole context data
interface ThemeContextData extends ThemeContextState {
  changeMode: (mode: string) => void,
}

// Create context
export const ThemeContext = createContext({} as ThemeContextData)
const { Provider, Consumer } = ThemeContext
export const ThemeConsumer = Consumer

export class ThemeProvider extends Component {

  // Initial state
  state: ThemeContextState = {
    color: 'skyBlueTheme',
    mode: 'light',
    sidebarOpen: true,
  }

  constructor(props: any) {
    super(props)

    const theme = loadStorage<IStorageTheme>(STORAGE_KEYS.THEME_KEY)

    // We do already have stored theme data?
    if (theme) {
      this.state = {
        ...this.state,
        ...theme
      }
    }
  }

  /**
   * Change theme mode
   *
   * @param mode
   */
  changeMode = (mode: string) => {
    this.setState({
      mode
    }, () => {
      saveStorage(STORAGE_KEYS.THEME_KEY, this.state)
    })
  }

  render() {
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
