import { Box, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { lazy, Suspense } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { MessageBoxProvider } from './components'
import { ThemeProvider } from './theme'

const Home = lazy(() => import('./views/Home'))
const About = lazy(() => import('./views/About'))

export function App() {
  return (
    <ThemeProvider>
      <CssBaseline>
        <MessageBoxProvider>
          <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'top' }} maxSnack={5} dense>
            <BrowserRouter>
              <Box
                component="section"
                sx={{
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                <Box
                  component="header"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/about">About</NavLink>
                </Box>
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    overflow: 'auto'
                  }}>
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
                </Box>
              </Box>
            </BrowserRouter>
          </SnackbarProvider>
        </MessageBoxProvider>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
