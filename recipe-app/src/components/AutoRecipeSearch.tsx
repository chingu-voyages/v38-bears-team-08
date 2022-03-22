import axios from 'axios'
import { ChangeEvent, useState, useEffect, SyntheticEvent } from 'react'

type optionType = {
  label: string
  value: string
}
type ingredientType = {
  name: string
  image: string
}

const AutoRecipeSearch = () => {
  const [ingredients, setIngredients] = useState('')
  const [recipies, setRecipies] = useState([])
  const [options, setOptions] = useState<optionType[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('useEffect')
    const fetchRecipies = async () => {
      try {
        console.log('fetchRecipies')
        const response = await axios.get(
          `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=f16eb0701234496cb34349250a29cb25&query=${ingredients}&number=10`
        )
        setRecipies(response.data)
        console.log('handleChange', response.data)
        const opts = response.data.map((item: ingredientType) => ({
          label: item.name,
          value: item.name
        }))
        setOptions(opts)
        console.log('options', opts)
        setError('')
      } catch (err) {
        setError('Error: No recipies found')
        console.log(err)
      }
    }
    fetchRecipies()
  }, [ingredients])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=f16eb0701234496cb34349250a29cb25`
      )
      setRecipies(response.data)
      console.log('handleSubmit', response.data)
      setError('')
    } catch (err) {
      setError('Error: No recipies found')
      console.log(err)
    }
  }
  // eslint-disable-next-line
  const handleChange = (e: SyntheticEvent): void => {
    const element = e.currentTarget as HTMLInputElement
    const value = element.value
    setIngredients(value)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor='ingredients'>Enter ingredients</label>
        <input
          id='ingredients'
          type='text'
          value={ingredients}
          onChange={handleChange}
          placeholder='separated them by commas'
        />

        <button type='submit'>Get Recipes</button>
      </form>
      {error && <p>{error}</p>}
    </>
  )
}

export default AutoRecipeSearch
