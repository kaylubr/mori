import { useEffect, useState } from "react"

import Header from "./components/Header"
import Footer from "./components/Footer"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"

const App = () => {
  const [page, setPage] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => setPage(window.location.hash)
    window.addEventListener("hashchange", handleHashChange)

    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <div className="app-shell">
      <Header />
      {page === "#register" ? <RegisterPage /> : <LoginPage />}
      <Footer />
    </div>
  )
}

export default App
