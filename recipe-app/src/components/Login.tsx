import React, { useState, FunctionComponent } from 'react'
import { login } from '../firebase/firebase'

interface loginDetailsType {
  email: string
  password: string
  [key: string]: string
}

interface serverErrorsType {
  message: string
}

interface serverError {
  message: string
}

const makeMessageHumanReadable = (message: string) => {
  const newMessage = message.substring(message.lastIndexOf('/') + 1).slice(0, -2)
  const errorMessage = newMessage.charAt(0).toUpperCase() + newMessage.slice(1)
  const errorMessageArray = errorMessage.split('-')
  const error = errorMessageArray.join(' ')
  return error
}

const DisplayErrors: FunctionComponent<serverErrorsType> = ({ message }) => {
  const error = makeMessageHumanReadable(message)
  return (
    <>
      <p className='error-msg'>{error}</p>
    </>
  )
}

const Login = () => {
  const [loginDetails, setLoginDetails] = useState<loginDetailsType>({
    email: '',
    password: ''
  })

  const [serverError, setServerError] = useState<serverErrorsType>()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setLoginDetails({
      ...loginDetails,
      [name]: value
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const user = await login(loginDetails.email, loginDetails.password)
      console.log(user)
    } catch (error: serverErrorsType | any) {
      setServerError(error)
      console.log(error)
    }
  }

  return (
    <div id='login-component'>
      {serverError ? (
        <DisplayErrors message={serverError.message} />
      ) : (
        <p className='error-msg'></p>
      )}
      <form id='login-form' action='' onSubmit={handleSubmit}>
        <div className='input-container'>
          <input
            className='login-input'
            type='email'
            id='email'
            name='email'
            value={loginDetails.email}
            onChange={handleChange}
            required
          />
          <label htmlFor='email'>Email</label>
        </div>
        <div className='input-container'>
          <input
            className='login-input'
            type='password'
            name='password'
            id='password'
            value={loginDetails.password}
            onChange={handleChange}
            required
          />
          <label htmlFor='username'>Password</label>
        </div>
        <button className='btn-primary'>Login</button>
      </form>
    </div>
  )
}

export default Login
