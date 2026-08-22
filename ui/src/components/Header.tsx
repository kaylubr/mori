import Navbar from "./Navbar"

const Header = () => {
  return (
    <header>
      <div className="brand-bar">
        <a
          className="brand"
          href="/"
          aria-label="Mori home"
        >
          MORI
        </a>
      </div>
      <Navbar/>
    </header>
  )
}

export default Header