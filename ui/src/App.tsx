import { useEffect, useState } from "react"

import Header from "./components/Header"
import Footer from "./components/Footer"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"

const App = () => {
  const [page, setPage] = useState(window.location.hash)
  const isAuthPage = page === "" || page === "#login" || page === "#register"

  useEffect(() => {
    const handleHashChange = () => setPage(window.location.hash)
    window.addEventListener("hashchange", handleHashChange)

    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <div className="app-shell">
      <Header isAuthPage={isAuthPage} />
      {page === "#register" ? <RegisterPage /> : <LoginPage />}
      <Footer />
    </div>
  )
}

export default App
