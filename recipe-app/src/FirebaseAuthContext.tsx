// FirebaseAuthContext.tsx
import { createContext, useContext, useState, useEffect, FC } from 'react'
import { auth } from './firebase/firebaseConfig'
import { User, onAuthStateChanged } from 'firebase/auth'

type UserType = User | null
type ContextState = { user: User | null }

// const auth = getAuth(db)

const FirebaseAuthContext = createContext<ContextState | undefined>(undefined)

const FirebaseAuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserType>(auth.currentUser || null)
  const [loading, setLoading] = useState(true)
  const value = { user }

  useEffect(() => {
    const userKey = Object.keys(window.sessionStorage).filter(it =>
      it.startsWith('firebase:authUser')
    )[0]
    console.log('userKey', userKey)
    if (userKey) {
      const localUser = userKey
        ? JSON.parse(sessionStorage.getItem(userKey) || '{}')
        : undefined
      console.log('localUser', localUser)
      setUser(localUser)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    setLoading(false)
    return unsubscribe
  }, [])

  return (
    <FirebaseAuthContext.Provider value={value}>
      {!loading && children}
    </FirebaseAuthContext.Provider>
  )
}

function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider')
  }
  return context.user
}

export { FirebaseAuthProvider, useFirebaseAuth }
