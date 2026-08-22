import Navbar from "./Navbar"

const Header = () => {
  return (
    <header>
      <div className="brand-bar">
        <span className="brand">MORI</span>
        <div className="auth-links">
          <a href="#login">Login</a>
          <p>/</p>
          <a href="#register">Register</a>
        </div>
      </div>
      <Navbar />
    </header>
  )
}

export default Header
