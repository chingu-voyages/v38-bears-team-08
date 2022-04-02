import axios from 'axios'
import React, { useState } from 'react'

interface loginDetailsType {
  email: string
  password: string
}

const Login = () => {
  const [loginDetails, setLoginDetails] = useState<loginDetailsType>({
    email: '',
    password: ''
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setLoginDetails({
      ...loginDetails,
      [name]: value
    })
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const data = await axios.post(
      'https://aqueous-dawn-28459.herokuapp.com/api/auth/sessions',
      {
        email: loginDetails.email,
        password: loginDetails.password
      }
    )
    console.log(data)
  }
  return (
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
  )
}

export default Login
