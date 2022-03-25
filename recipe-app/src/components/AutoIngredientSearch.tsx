import { useState, useEffect, SyntheticEvent, FunctionComponent } from 'react'
import axios from 'axios'
import './styles.css'

type optionType = {
  label: string
  value: string
}
type ingredientType = {
  name: string
  image: string
}

interface AutoIngredientSearchProps {
  setIngredients: (recipies: string[]) => void
}

interface recipyType {
  id: number
  title: string
  image: string
}
interface RecipiesViewProps {
  recipies: recipyType[]
}

/**
 *
 *  This component is to add/create a list of ingridients
 */
const AutoIngredientSearch: FunctionComponent<AutoIngredientSearchProps> = ({
  setIngredients
}) => {
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
        setError('Error: No recipies found')
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

  const ingredientIsEmpty = ingredient.trim().length === 0
  const ingredientsListDoesNotContainIngredient = !ingredientsList.includes(ingredient)
  const ingredientExists = ingredient

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (ingredientIsEmpty) {
      setError('Error: cannot be empty')
      return void 0
    }

    if (ingredientExists && ingredientsListDoesNotContainIngredient) {
      setIngridientsList([...ingredientsList, ingredient])
      setIngredient('')
    } else {
      setError('Error: Ingredient already in the list')
    }
  }

  const handleChange = (e: SyntheticEvent): void => {
    const element = e.currentTarget as HTMLInputElement
    console.log
    setIngredient(element.value)
  }

  return (
    <>
      <div id='ingredient-search'>
        <div id='ingredients-tags'>
          {ingredientsList.length > 0 &&
            ingredientsList.map(ingredient => (
              <span className='ingredient-tags-item' key={ingredient}>
                {ingredient}{' '}
                <button className='x-btn' onClick={e => removeIngredientFromList(e)}>
                  x
                </button>
              </span>
            ))}
        </div>
        <form id='ingredient-form' onSubmit={handleSubmit}>
          <input
            id='ingredients'
            list='ingredients-list'
            value={ingredient}
            onChange={handleChange}
            placeholder={error.length > 0 ? error : 'e.g chicken'}
          />
          <label htmlFor='ingredients'>Enter ingredients</label>
          <datalist id='ingredients-list'>
            {options
              ? options.map((item: optionType) => (
                  <option key={item.label} value={item.value} />
                ))
              : null}
          </datalist>
          <button className='btn-primary' type='submit'>
            Add ingredient
          </button>
        </form>
      </div>
    </>
  )
}

const RecipiesView: FunctionComponent<RecipiesViewProps> = ({ recipies }) => {
  return (
    <div id='recipies-grid'>
      {recipies.map((recipe: recipyType) => (
        <div id='recipy' key={recipe.id}>
          <img id='recipe-image' src={recipe.image} alt={recipe.title} />
          <span id='recipe-title'>{recipe.title}</span>
        </div>
      ))}
    </div>
  )
}

export default function GetRecipies() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipies, setRecipies] = useState<recipyType[]>([])
  const [error, setError] = useState('')

  const handleClick = async () => {
    console.log('ingredients', ingredients)
    if (ingredients.length > 0) {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=100&apiKey=f16eb0701234496cb34349250a29cb25`
        )
        setRecipies(response.data)
        console.log('handleSubmit in GetRecipies', response.data)
        setError('')
      } catch (err) {
        setError('Error: No recipies found')
        console.log(err)
      }
    } else {
      setError('Error: No ingredients entered')
    }
  }
  // TODO: Imporve error msg
  return (
    <>
      <div id='search-component'>
        <AutoIngredientSearch setIngredients={setIngredients} />
        <button className='btn-primary' onClick={handleClick} type='submit'>
          Get Recipes
        </button>
        {error && <p>{error}</p>}
      </div>
      {recipies.length !== 0 ? <RecipiesView recipies={recipies} /> : null}
    </>
  )
}
