import { Outlet, useLocation } from "react-router-dom"

import Header from "./components/Header"
import Footer from "./components/Footer"

const App = () => {
  const { pathname } = useLocation()
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <div className="app-shell">
      <Header isAuthPage={isAuthPage} />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
