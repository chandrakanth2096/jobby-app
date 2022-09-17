import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogoutBtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="link">
        <img
          className="website-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="nav-items-sm">
        <li>
          <Link to="/" className="link">
            <AiFillHome size="25" />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="link">
            <BsBriefcaseFill size="25" />
          </Link>
        </li>
        <li>
          <FiLogOut size="25" onClick={onClickLogoutBtn} />
        </li>
      </ul>

      <ul className="nav-items-lg">
        <Link to="/" className="link-lg">
          <li>Home</li>
        </Link>
        <Link to="/jobs" className="link-lg">
          <li>Jobs</li>
        </Link>
      </ul>

      <button type="button" className="logout-btn" onClick={onClickLogoutBtn}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
