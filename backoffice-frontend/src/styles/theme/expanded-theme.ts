import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides'
import '@material-ui/core/styles'

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
}

type CustomType = {
  MuiPickersBasePicker: {
    pickerView: {
      maxWidth?: string
    }
  }
}

declare module '@material-ui/core/styles/overrides' {
  // tslint:disable-next-line:no-empty-interface
  interface ComponentNameToClassKey extends overridesNameToClassKey { }
  // tslint:disable-next-line:no-empty-interface
  export interface ComponentNameToClassKey extends CustomType { }
}

declare module '@material-ui/core/styles/createPalette' {
  export interface Palette {
    purple: {
      primary: PaletteColor
    },
    white: PaletteColor
    orange: string
    black: {
      primary: PaletteColor
    }
    red: PaletteColor
    yellow: {
      primary: PaletteColor
    }
    select: PaletteColor
    green: PaletteColor
  }

  interface PaletteOptions {
    purple: {
      primary: PaletteColor
    }
    white: PaletteColor
    orange: string,
    black: {
      primary: PaletteColor
    }
    red: PaletteColor
    yellow: {
      primary: PaletteColor
    }
    select: PaletteColor
    green: PaletteColor
  }

  interface PaletteColor {
    darker?: string
    lighter?: string
  }

  interface SimplePaletteColorOptions {
    lighter?: string,
    darker?: string,
  }
}

declare module '@material-ui/core' {
  interface Color {
    primary: {
      light: string
      dark: string
    }
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Palette {
    secondary: {
      lighter: string
    }
  }
  interface Theme {
    glow: {
      light: string,
      medium: string,
      dark: string
    },
    rounded: {
      small: string,
      medium: string,
      big: string
    }
  }
  interface ThemeOptions {
    glow: {
      light: string,
      medium: string,
      dark: string
    },
    rounded: {
      small: string,
      medium: string,
      big: string
    }
  }
}