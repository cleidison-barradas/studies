import 'styled-components'
import Theme from './interfaces/theme/Theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
