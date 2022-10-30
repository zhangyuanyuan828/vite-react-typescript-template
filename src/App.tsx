import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { lazy, Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MessageBoxProvider } from './components'
import { i18n } from './i18n'
import { ThemeProvider } from './theme'

const Home = lazy(() => import('./views/Home'))
const About = lazy(() => import('./views/About'))

export function App() {
  return (
    <ThemeProvider>
      <CssBaseline>
        <I18nextProvider i18n={i18n}>
          <MessageBoxProvider>
            <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'top' }} maxSnack={5} dense>
              <BrowserRouter>
                <Routes>
                  <Route
                    index
                    element={
                      <Suspense>
                        <Home />
                      </Suspense>
                    }
                  />
                  <Route
                    path="about"
                    element={
                      <Suspense>
                        <About />
                      </Suspense>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </SnackbarProvider>
          </MessageBoxProvider>
        </I18nextProvider>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
