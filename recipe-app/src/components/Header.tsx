import { NavLink } from 'react-router-dom'
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
  // TODO: Add class for active link
  return (
    <header>
      <img src={Logo} alt='Logo' />
      <h1>Recipe App</h1>
      <nav>
        <ul>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          {!user ? (
            <>
              <li>
                <NavLink to='/register'>Register</NavLink>
              </li>
              <li>
                <NavLink to='/login'>Login</NavLink>
              </li>
            </>
          ) : (
            <li>
              <a href='' onClick={handleLogout}>
                Logout
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
