/** @jsxImportSource @emotion/react */ 
import { useState, useEffect, SyntheticEvent, FunctionComponent } from 'react'
import axios from 'axios'
import { jsx } from '@emotion/react'

type optionType = {
  label: string
  value: string
}
type ingredientType = {
  name: string
  image: string
}

interface Props {
  setIngredients: (recipes: string[]) => void
}

/**
 *
 *  This component is to add/create a list of ingridients
 */
// TODO: add setRecipies function as prop
const AutoIngredientSearch: FunctionComponent<Props> = ({ setIngredients }) => {
  const [ingredient, setIngredient] = useState('')
  const [ingredientsList, setIngridientsList] = useState<string[]>([])
  const [options, setOptions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecipies = async () => {
      try {
        console.log('fetchRecipies')
        const response = await axios.get(
          `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=f16eb0701234496cb34349250a29cb25&query=${ingredient}&number=10`
        )

        console.log('handleChange', response.data)
        const opts = response.data.map((item: ingredientType) => ({
          label: item.name,
          value: item.name
        }))
        setOptions(opts)
        console.log('options', opts)
        setError('')
      } catch (err) {
        setError('Error: No recipes found')
        console.log(err)
      }
    }
    if (ingredient) {
      fetchRecipies()
    }
  }, [ingredient])

  useEffect(() => {
    setIngredients([...ingredientsList])
  }, [ingredientsList])

  const removeIngredientFromList = (e: SyntheticEvent) => {
    const element = e.currentTarget as HTMLInputElement
    const itemToRemove = element.parentElement?.innerText.split(' ')[0]
    setIngridientsList(ingredientsList.filter(item => item !== itemToRemove))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    // TODO: set ingridientsList only if ingredient is not in the list already
    if (ingredient && !ingredientsList.includes(ingredient)) {
      setIngridientsList([...ingredientsList, ingredient])
      setIngredient('')
    } else {
      setError('Error: Ingredient already in the list')
    }
  }

  const handleChange = (e: SyntheticEvent): void => {
    const element = e.currentTarget as HTMLInputElement
    setIngredient(element.value)
  }
  return (
    <>
      <div id='ingredient-search'>
        <div id='ingredites-list' style={{ height: '1em' }}>
          {ingredientsList.length > 0 &&
            ingredientsList.map(ingredient => (
              <span key={ingredient}>
                {ingredient} <button onClick={e => removeIngredientFromList(e)}>x</button>
              </span>
            ))}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='ingredients'>Enter ingredients</label>
          <input
            id='ingredients'
            list='ingredients-list'
            value={ingredient}
            onChange={handleChange}
            placeholder='e.g. chicken'
          />
          <datalist id='ingredients-list'>
            {options
              ? options.map((item: optionType) => (
                  <option key={item.label} value={item.value} />
                ))
              : null}
          </datalist>
          <button type='submit'>Add ingredient</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  )
}

interface recipeType {
  title: string,
  id: number,
  image: string,
}

export default function GetRecipies() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipies] = useState<recipeType[]>([])
  const [error, setError] = useState('')

  const handleClick = async () => {
    console.log(ingredients)
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=f16eb0701234496cb34349250a29cb25`
      )
      setRecipies(response.data)
      console.log('handleSubmit in GetRecipies', response.data)
      setError('')
    } catch (err) {
      setError('Error: No recipes found')
      console.log(err)
    }
  }
  console.log(recipes);

  return (
    <>
      <AutoIngredientSearch setIngredients={setIngredients} />
      <button onClick={handleClick} type='submit'>
        Get Recipes
      </button>
      {error && <p>{error}</p>}
      {
        recipes.length === 0 ?
          null
          :
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              margin: 'auto',
              width: '80%',
            }}
           id="recipes-grid">
          {
            recipes.map((recipe) => (
            <div id="recipe" key={recipe.id} css={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <img id="recipe-image" src={recipe.image} alt={recipe.title} />
              <span id="recipe-title">{recipe.title}</span>
            </div>
          ))
          }
      </div>
      }
    </>
  )
}
