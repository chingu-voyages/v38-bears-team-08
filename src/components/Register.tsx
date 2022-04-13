import React, { useState, FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'
import Info from './icons8-info-48.png'
import Modal from './Modal'
import { registerUser } from '../firebase/firebase'
interface registerType {
  email: string
  username: string
  password: string
  [key: string]: string
}

interface formErrorsType {
  email?: string
  username?: string
  password?: string
  [key: string]: string | undefined
}

interface serverErrorsType {
  message: string
}

const passwordRequirements = `Password should have at least: one upper case and one lower case letters, one digit, one special character (e.g *!#@$%^&*-),
and be between 8 and 20 characters.`

const errorObjectIsEmpty = (errorObject: formErrorsType) => {
  return Object.keys(errorObject).every((key: string) => errorObject[key] === '')
}

const removeErrorsFromErrorObject = (errorObject: formErrorsType) => {
  const errorObjectCopy = { ...errorObject }
  for (const error in errorObjectCopy) {
    if (Object.prototype.hasOwnProperty.call(errorObjectCopy, error)) {
      errorObjectCopy[error] = ''
    }
  }
  return errorObjectCopy
}

const checkFormForErrors = (error: registerType) => {
  const errorObject = {}

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(error.email)) {
    Object.assign(errorObject, { email: 'Email is not valid.' })
  }

  if (error.username.trim().length < 3) {
    Object.assign(errorObject, {
      username: 'Username must be at least 3 characters.'
    })
  }

  const passwordPattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/
  if (!passwordPattern.test(error.password)) {
    Object.assign(errorObject, {
      password: 'Password is not valid. Click/tap the info icon above.'
    })
  }
  return errorObject
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

const Register = () => {
  const navigate = useNavigate()
  const [state, setState] = useState<registerType>({
    email: '',
    username: '',
    password: ''
  } as registerType)

  const [formErrors, setFormErrors] = useState<formErrorsType>({
    email: '',
    username: '',
    password: ''
  } as registerType)

  const [serverErrors, setServerErrors] = useState<serverErrorsType>()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    setState({
      ...state,
      [target.name]: target.value
    })
    setFormErrors({
      email: '',
      username: '',
      password: ''
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
        const newUser = await registerUser(state.username, state.email, state.password)
        console.log('newUser created succesfully', newUser)

        navigate('/login', {
          replace: true,
          state: { message: 'You have succesfully registered.' }
        })
      } catch (error: serverErrorsType | any) {
        setServerErrors(error)
      }
    } else {
      console.log('setFormErrors')
      setFormErrors(prevErrors => ({ ...prevErrors, ...errorObject }))
      const errObj = removeErrorsFromErrorObject(errorObject)
      setState(prevState => ({
        ...prevState,
        ...(errObj as registerType)
      }))
    }
  }

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }
  console.log('serverErrors', serverErrors)
  console.log('typeof serverErrors', typeof serverErrors)
  return (
    <div id='register-component'>
      {serverErrors ? (
        <DisplayErrors message={serverErrors.message} />
      ) : (
        <p className='error-msg'></p>
      )}
      <form id='register-form' action='' onSubmit={handleSubmit}>
        <div className='input-container'>
          <input
            autoFocus
            className='register-input'
            type='email'
            name='email'
            value={state.email}
            id='email'
            onChange={handleChange}
            placeholder={formErrors.email?.length ? formErrors.email : 'e.g. Email'}
            required
          />
          <label htmlFor='email'>Email</label>
        </div>
        <div className='input-container'>
          <input
            className='register-input'
            type='text'
            name='username'
            value={state.username}
            id='username'
            onChange={handleChange}
            placeholder={formErrors.username ? formErrors.username : 'e.g. ninja23'}
            required
          />
          <label htmlFor='username'>Username</label>
        </div>
        <div className='input-container'>
          <input
            className='register-input'
            type='password'
            name='password'
            value={state.password}
            id='password'
            onChange={handleChange}
            placeholder={
              formErrors.password ? formErrors.password : 'a strong one please'
            }
            required
          />
          <img
            id='info-icon'
            src={Info}
            alt='password-information'
            title={passwordRequirements}
            onClick={handleClick}
          />
          <Modal isOpen={isModalOpen} closeModal={handleModalClose}>
            {<p>{passwordRequirements}</p>}
          </Modal>
          <label htmlFor='password'>Password</label>
        </div>
        <button className='btn-primary' type='submit'>
          Register
        </button>
      </form>
    </div>
  )
}
export default Register
