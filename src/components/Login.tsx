import React, { useState, FC, useEffect } from 'react'
import { login } from '../firebase/firebase'
import Modal from './Modal'
import ResetPassword from './ResetPassword'
import { useLocation } from 'react-router-dom'
import { getUserRecipes } from '../firebase/firebase'
import { User } from 'firebase/auth'
interface loginDetailsType {
  email: string
  password: string
  [key: string]: string
}

interface serverErrorsType {
  message: string
}

const makeMessageHumanReadable = (message: string) => {
  const newMessage = message.substring(message.lastIndexOf('/') + 1).slice(0, -2)
  const errorMessage = newMessage.charAt(0).toUpperCase() + newMessage.slice(1)
  const errorMessageArray = errorMessage.split('-')
  const error = errorMessageArray.join(' ')
  return error
}

const DisplayErrors: FC<serverErrorsType> = ({ message }) => {
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [saveError, setSaveError] = useState<string>('')

  const location = useLocation()

  useEffect(() => {
    const checkSaveError = () => {
      if (location.state) {
        const { message } = location.state as serverErrorsType
        setSaveError(message)
        window.history.replaceState({}, '')
      } else {
        setSaveError('')
      }
    }
    checkSaveError()
  }, [location])

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
      const currentUser = await login(loginDetails.email, loginDetails.password)
      await getUserRecipes(currentUser)
    } catch (error: serverErrorsType | any) {
      setServerError(error)
    }
  }

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div id='login-component'>
      {serverError ? (
        <DisplayErrors message={serverError.message} />
      ) : (
        <p className='error-msg'>{saveError !== '' ? saveError : ''}</p>
      )}
      <form id='login-form' action='' onSubmit={handleSubmit}>
        <div className='input-container'>
          <input
            autoFocus
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
          <label htmlFor='password'>Password</label>
        </div>
        <button className='btn-primary'>Login</button>
      </form>
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <ResetPassword closeModal={closeModal} />
      </Modal>
      <button className='btn-primary' onClick={handleClick}>
        I forgot my password
      </button>
    </div>
  )
}

export default Login
