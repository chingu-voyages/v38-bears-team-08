/* eslint-disable jsx-a11y/anchor-is-valid */
import { NavLink, Link } from 'react-router-dom'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'
import { logout } from '../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import Logo from './berries_optimized.jpg'

const Header = () => {
  const user = useFirebaseAuth() || auth.currentUser
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header>
      <Link to={'/'}>
        <img src={Logo} alt='Logo' title='Logo' />
      </Link>
      <h1>Recipe App</h1>
      <nav>
        <ul>
          <li>
            <NavLink
              to='/'
              style={({ isActive }) => ({
                color: isActive ? '#08ce01' : '#4b91f7'
              })}>
              Home
            </NavLink>
          </li>
          {!user ? (
            <>
              <li>
                <NavLink
                  to='/register'
                  style={({ isActive }) => ({
                    color: isActive ? '#08ce01' : '#4b91f7'
                  })}>
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/login'
                  style={({ isActive }) => ({
                    color: isActive ? '#08ce01' : '#4b91f7'
                  })}>
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to='/saved-recipes'
                  style={({ isActive }) => ({
                    color: isActive ? '#08ce01' : '#4b91f7'
                  })}>
                  Saved Recipes
                </NavLink>
              </li>
              <li>
                <a href='' onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
