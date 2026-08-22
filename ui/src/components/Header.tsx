import { Link } from "react-router-dom"

type HeaderProps = {
  isAuthPage: boolean
}

const Header = ({ isAuthPage }: HeaderProps) => {
  return (
    <header>
      <div className="brand-bar">
        <span className="brand">MORI</span>
        <nav
          className="secondary-nav"
          aria-label="Main navigation"
        >
          <Link to="/catalog">Catalog</Link>
          <Link to="/shelf">My Shelf</Link>
          <Link to="/community">Community</Link>
        </nav>
        {!isAuthPage && (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <p>/</p>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
