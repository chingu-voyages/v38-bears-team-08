import React, { useState, useEffect, useRef, FC } from 'react'
import { resetPassword } from '../firebase/firebase'
import { useNavigate } from 'react-router-dom'

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

const ResetPassword = () => {
  const [serverError, setServerError] = useState<serverErrorsType>()
  const [resetEmailInput, setResetEmailInput] = useState<string>('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleResetEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      await resetPassword(resetEmailInput)
      navigate('/login', { replace: true })
    } catch (error: serverErrorsType | any) {
      setServerError(error)
      console.log(error)
    }
  }

  const handleResetEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setResetEmailInput(value)
  }

  return (
    <>
      {serverError ? (
        <DisplayErrors message={serverError.message} />
      ) : (
        <p className='error-msg'></p>
      )}
      <form id='reset-password-form' onSubmit={handleResetEmailSubmit}>
        <div className='input-container'>
          <input
            ref={inputRef}
            className='reset-email-input'
            type={'email'}
            id='reset-email'
            name='reset-email'
            onChange={handleResetEmailChange}
            value={resetEmailInput}
            required
          />
          <label htmlFor='reset-email'>Email</label>
        </div>
        <button className='btn-primary reset-password-btn' type='submit'>
          Send reset password
        </button>
      </form>
    </>
  )
}

export default ResetPassword
