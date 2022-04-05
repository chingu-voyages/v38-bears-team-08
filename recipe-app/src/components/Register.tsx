import { SyntheticEvent, useState } from 'react'
import axios from 'axios'

interface registerType {
  email: string
  username: string
  password: string
}

const Register = () => {
  const [state, setState] = useState<registerType>({
    email: '',
    username: '',
    password: ''
  } as registerType)

  const handleChange = (e: SyntheticEvent) => {
    const target = e.currentTarget as HTMLInputElement
    setState({
      ...state,
      [target.name]: target.value
    })
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLInputElement
    console.log(target.name, state)
    axios.post('https://aqueous-dawn-28459.herokuapp.com/api/auth/register', {
      data: {
        email: state.email,
        username: state.username,
        password: state.password
      }
    })
  }

  return (
    <form id='register-form' action='' onSubmit={handleSubmit}>
      <label htmlFor='email'>Email</label>
      <input
        type='email'
        name='email'
        value={state.email}
        id='email'
        onChange={handleChange}
        required
      />
      <label htmlFor='username'>Username</label>
      <input
        type='text'
        name='username'
        value={state.username}
        id='username'
        onChange={handleChange}
        required
      />
      <label htmlFor='password'>Password</label>
      <input
        type='password'
        name='password'
        value={state.password}
        id='password'
        onChange={handleChange}
        required
      />
      <button type='submit'>Register</button>
    </form>
  )
}
export default Register
