import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { login } from '../firebase/firebase'
import { auth } from '../firebase/firebaseConfig'
import { useFirebaseAuth } from '../FirebaseAuthContext'

interface loginDetailsType {
  email: string
  password: string
}

interface LocationParams {
  pathname: string
  state: {
    message: string
  } | null
  search: string
  hash: string
  key: string
}

const Login = () => {
  const location = useLocation() as LocationParams
  const user = useFirebaseAuth() || auth.currentUser
  const state = location?.state || null

  console.log('Login user', user?.displayName)

  const [loginDetails, setLoginDetails] = useState<loginDetailsType>({
    email: '',
    password: ''
  })

  console.log('login router state', state)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setLoginDetails({
      ...loginDetails,
      [name]: value
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const { email, password } = loginDetails
    const data = await login(email, password)
    console.log('data', data)
  }
  return (
    <>
      <h1>Login</h1>
      {user?.displayName || 'Please login'}
      <p>{state && state.message !== '' ? state.message : null}</p>
      <form action='' onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
          value={loginDetails.email}
          onChange={handleChange}
        />
        <label htmlFor='username'>Username</label>
        <input
          type='password'
          name='password'
          id='password'
          value={loginDetails.password}
          onChange={handleChange}
        />
        <button id='login-btn'>Login</button>
      </form>
    </>
  )
}

export default Login
