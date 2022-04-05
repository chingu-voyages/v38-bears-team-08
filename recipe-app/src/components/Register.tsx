import React, { useState } from 'react'
import axios from 'axios'

interface registerType {
  email: string
  username: string
  password: string
  [key: string]: string
}

const errorObjectIsEmpty = (errorObject: registerType) => {
  return Object.keys(errorObject).every((key: string) => errorObject[key] === '')
}

const checkFormForErrors = (error: registerType) => {
  const errorObject = { email: '', username: '', password: '' }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(error.email)) {
    Object.assign(errorObject, { email: 'Email is not valid' })
  }

  if (error.username.trim().length < 3) {
    Object.assign(errorObject, { username: 'Username must be at least 3 characters' })
  }

  const passwordPattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/
  if (!passwordPattern.test(error.password)) {
    Object.assign(errorObject, {
      password: `Password should have at least one upper case English letter,
        at least one lower case English letter,
        at least one digit,
        at least one special character, (?=.*[]#!@$%^&*-)
        and be between 8 and 20 characters in length.`
    })
  }
  return errorObject
}

const Register = () => {
  const [state, setState] = useState<registerType>({
    email: '',
    username: '',
    password: ''
  } as registerType)

  const [error, setError] = useState<registerType>({
    email: '',
    username: '',
    password: ''
  } as registerType)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    setState({
      ...state,
      [target.name]: target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('state', state)
    const errorObject = checkFormForErrors(state)
    console.log('errorObject', errorObject)

    console.log('errorObjectIsEmpty', errorObjectIsEmpty(errorObject))

    if (errorObjectIsEmpty(errorObject)) {
      try {
        const data = await axios.post(
          'https://aqueous-dawn-28459.herokuapp.com/api/auth/register',
          {
            email: state.email,
            username: state.username,
            password: state.password
          }
        )
      } catch (error) {
        console.log(error)
      }
    } else {
      setError(error => Object.assign(error, errorObject))
      return void 0 // exit function
    }
  }

  return (
    <div id='register-component'>
      <form id='register-form' action='' onSubmit={handleSubmit}>
        <div className='input-container'>
          <input
            className='register-input'
            type='email'
            name='email'
            value={state.email}
            id='email'
            onChange={handleChange}
            placeholder='e.g. Email'
            required
          />
          <label htmlFor='email'>Email</label>
          {error.email && <p className='error-msg'>{error.email}</p>}
        </div>
        <div className='input-container'>
          <input
            className='register-input'
            type='text'
            name='username'
            value={state.username}
            id='username'
            onChange={handleChange}
            placeholder='e.g. ninja23'
            required
          />
          <label htmlFor='username'>Username</label>
          {error.username && <p className='error-msg'>{error.username}</p>}
        </div>
        <div className='input-container'>
          <input
            className='register-input'
            type='password'
            name='password'
            value={state.password}
            id='password'
            onChange={handleChange}
            placeholder='between 8 and 20 characters lower and upper case letters and numbers'
            required
          />
          <label htmlFor='password'>Password</label>
          {error.password && <p className='error-msg'>{error.password}</p>}
        </div>
        <button className='btn-primary' type='submit'>
          Register
        </button>
      </form>
    </div>
  )
}
export default Register
