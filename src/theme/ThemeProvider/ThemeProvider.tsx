import { createTheme, PaletteMode, Theme, ThemeProvider as MuiThemeProvider, useMediaQuery, useTheme } from '@mui/material'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ColorMode = PaletteMode | 'system'

export interface ColorModeStorage {
  getColorMode: () => ColorMode | null | undefined

  setColorMode: (colorMode: ColorMode) => void
}

export interface ThemeProviderProps extends Partial<React.ComponentProps<typeof MuiThemeProvider<Theme>>> {
  defaultColorMode?: ColorMode

  colorModeStorage?: ColorModeStorage
}

export interface ColorModeContextType {
  colorMode: ColorMode

  setColorMode: (colorMode: ColorMode) => void
}

export const ColorModeConxtext = createContext<ColorModeContextType>({
  colorMode: 'system',
  setColorMode: (colorMode: ColorMode) => {}
})

export const ColorModeProvider = ColorModeConxtext.Provider

export const useColorMode = () => useContext(ColorModeConxtext)

export const usePaletteMode = () => {
  return useTheme().palette.mode
}

export const useColorModeValue = <TLight, TDark>(light: TLight, dark: TDark) => {
  return usePaletteMode() === 'light' ? light : dark
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ defaultColorMode, colorModeStorage, theme, children }) => {
  const [colorMode, setColorMode] = useState<ColorMode>(colorModeStorage?.getColorMode() || 'system')
  const matches = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    setColorMode(colorModeStorage?.getColorMode() || defaultColorMode || 'system')
  }, [defaultColorMode, colorModeStorage])

  const colorModeProviderValue = useMemo(() => {
    return {
      colorMode,
      setColorMode(colorMode: ColorMode) {
        setColorMode(colorMode)
        colorModeStorage?.setColorMode(colorMode)
      }
    }
  }, [colorMode, colorModeStorage])

  const themeProviderValue = useMemo(() => {
    if (typeof theme === 'function') {
      const createTheme = theme
      return (outerTheme: Theme) => {
        const theme = createTheme(outerTheme)
        theme.palette.mode = colorMode === 'system' ? (matches ? 'dark' : 'light') : colorMode
        return theme
      }
    }
    return createTheme({
      ...theme,
      palette: {
        ...theme?.palette,
        mode: colorMode === 'system' ? (matches ? 'dark' : 'light') : colorMode
      }
    })
  }, [theme, colorMode, matches])

  return (
    <ColorModeProvider value={colorModeProviderValue}>
      <MuiThemeProvider theme={themeProviderValue}>{children}</MuiThemeProvider>
    </ColorModeProvider>
  )
}

ThemeProvider.defaultProps = {
  defaultColorMode: 'system',
  colorModeStorage: {
    getColorMode() {
      const colorMode = localStorage.getItem('colorMode')
      if (!colorMode) {
        return null
      }
      if (colorMode === 'light' || colorMode === 'dark' || colorMode === 'system') {
        return colorMode
      }
      return null
    },
    setColorMode(colorMode: ColorMode) {
      localStorage.setItem('colorMode', colorMode)
    }
  }
}
