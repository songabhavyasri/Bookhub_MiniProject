import './index.css'
import {Link, withRouter} from 'react-router-dom'
import {useState} from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'
import {FiSun} from 'react-icons/fi'
import {AiOutlineClose} from 'react-icons/ai'
import {BiMoon} from 'react-icons/bi'
import Cookies from 'js-cookie'
import BookshelvesContext from '../../context/BookshelvesContext'

const Header = props => {
  const [menuOpen, setMenuOpen] = useState(false)
  const onClickLogoutBtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const {home, bookShelvesList, favorites} = props
  const activeTab = home ? 'active-tab' : ''
  const activeBookShelves = bookShelvesList ? 'active-tab' : ''
  const favTab = favorites ? 'active-tab' : ''

  return (
    <BookshelvesContext.Consumer>
      {value => {
        const {onClickTheme, themeMode} = value

        return (
          <header className={`responsiveNavbar ${themeMode && 'darkTheme'}`}>
            <nav className={themeMode ? 'm-nav' : 'navbar'}>
              <Link className="link" to="/">
                <img
                  className="home-logo"
                  alt="website logo"
                  src="https://res.cloudinary.com/dgonqoet4/image/upload/v1686887647/bookhublogo_upkhlx.png"
                />
              </Link>
              <div className="nav-ul-items">
                <ul className="nav-links">
                  <Link className={`link ${activeTab}`} to="/">
                    <li className="list">Home</li>
                  </Link>
                  <Link className={`link ${activeBookShelves}`} to="/shelf">
                    <li className="list">Bookshelves</li>
                  </Link>
                  <Link to="/myfavorite" className={`link ${favTab}`}>
                    <li className="list">Myfavorite</li>
                  </Link>
                  <button
                    className="themeSwitcher"
                    type="button"
                    onClick={onClickTheme}
                  >
                    {themeMode ? (
                      <FiSun
                        className={`theme-icon ${themeMode && 'themeColor'}`}
                      />
                    ) : (
                      <BiMoon className="theme-icon" />
                    )}
                  </button>
                </ul>
                <button
                  className="logout-btn"
                  type="button"
                  onClick={onClickLogoutBtn}
                >
                  Logout
                </button>
              </div>
              <div className="mobileNav">
                <div>
                  <button
                    className="themeSwitcher"
                    type="button"
                    onClick={onClickTheme}
                  >
                    {themeMode ? (
                      <FiSun
                        className={`theme-icon ${themeMode && 'themeColor'}`}
                      />
                    ) : (
                      <BiMoon className="theme-icon" />
                    )}
                  </button>
                </div>
                {menuOpen ? (
                  <AiOutlineClose onClick={() => setMenuOpen(!menuOpen)} />
                ) : (
                  <GiHamburgerMenu onClick={() => setMenuOpen(!menuOpen)} />
                )}
              </div>
            </nav>
            {menuOpen && (
              <div className="mobileNav">
                <ul className="nav-links">
                  <Link className={`link ${activeTab}`} to="/">
                    <li className="list">Home</li>
                  </Link>
                  <Link className={`link ${activeBookShelves}`} to="/shelf">
                    <li className="list">Bookshelves</li>
                  </Link>
                  <Link to="/myfavorite" className={`link ${favTab}`}>
                    <li className="list">Myfavorite</li>
                  </Link>
                </ul>
                <button
                  className="logout-btn"
                  type="button"
                  onClick={onClickLogoutBtn}
                >
                  Logout
                </button>
              </div>
            )}
          </header>
        )
      }}
    </BookshelvesContext.Consumer>
  )
}

export default withRouter(Header)
