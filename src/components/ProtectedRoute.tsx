import { useNavigate, Outlet } from 'react-router-dom'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'
import React from 'react'

interface ProtectedRouteProps {
  redirectPath?: string
  children?: JSX.Element
}

const ProtectedRoute = ({
  redirectPath = '/login',
  children
}: ProtectedRouteProps): JSX.Element => {
  const user = useFirebaseAuth() || auth.currentUser
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user !== null) {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, redirectPath, user])

  return children ? children : <Outlet />
}

export default ProtectedRoute
