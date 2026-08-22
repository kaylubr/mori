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
          <a href="#catalog">Catalog</a>
          <a href="#shelf">My Shelf</a>
          <a href="#community">Community</a>
        </nav>
        {!isAuthPage && (
          <div className="auth-links">
            <a href="#login">Login</a>
            <p>/</p>
            <a href="#register">Register</a>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
