import axios from 'axios'
import { useState } from 'react'

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState('')
  const [recipies, setRecipies] = useState([])
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=${process.env.REACT_APP_API_KEY}`
      )
      setRecipies(response.data)
      console.log(response.data)
      setError('')
    } catch (err) {
      setError('Error: No recipies found')
      console.log(err)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor='ingredients'>Enter ingredients</label>
        <input
          id='ingredients'
          type='text'
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          placeholder='separated them by commas'
        />
        <button type='submit'>Search</button>
      </form>
      {error && <p>{error}</p>}
    </>
  )
}

export default RecipeSearch
