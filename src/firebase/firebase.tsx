import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import { auth } from './firebaseConfig'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type errorObject = {
  message: string
  code: number
}

const registerUser = async (username: string, email: string, password: string) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(newUser.user, {
      displayName: username
    })
    console.log('registerUser newUser', newUser)
    return {
      message: 'You have successfully registered',
      code: 200
    }
  } catch (error: errorObject | any) {
    console.log()
    console.log('registerUser error', error)
    throw new Error(error)
  }
}

const login = async (email: string, password: string) => {
  try {
    await setPersistence(auth, browserSessionPersistence)
    const currentUser = await signInWithEmailAndPassword(auth, email, password)
    console.log('currentUser', currentUser)
    return currentUser.user
  } catch (error: errorObject | any) {
    console.log('error.message', error.message)
    console.log('error.code', error.code)
    console.log('error.name', error.name)
    throw new Error(error.message)
  }
}

const logout = async () => {
  try {
    const logOutUser = await signOut(auth)
    console.log('logOutUser', logOutUser)
    return {
      message: 'You have successfully logged out',
      code: 200
    }
  } catch (error: errorObject | any) {
    console.log(error)
    throw new Error(error.message)
  }
}

const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return {
      message: 'Password reset email sent',
      code: 200
    }
  } catch (error: errorObject | any) {
    console.log(error)
    throw new Error(error.message)
  }
}

export { registerUser, login, logout, resetPassword }
