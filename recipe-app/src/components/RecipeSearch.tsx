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
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=f16eb0701234496cb34349250a29cb25`
      );
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
        <button type='submit'>Add Ingredient</button>
      </form>
      {error && <p>{error}</p>}
    </>
  )
}

export default RecipeSearch
