import { lazy, Suspense } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./views/Home'))
const About = lazy(() => import('./views/About'))

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <NavLink to="/">Home</NavLink>|<NavLink to="/about">About</NavLink>
        </header>
        <main>
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
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
