import { Navigate, Outlet } from 'react-router-dom'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'

const AuthenticatedRoute = () : JSX.Element => {

  const user = useFirebaseAuth() || auth.currentUser
  
  return user ? <Outlet /> : <Navigate to="login" />
}

export default AuthenticatedRoute